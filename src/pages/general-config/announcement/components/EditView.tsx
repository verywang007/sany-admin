import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { App, Button, Checkbox, DatePicker, Input, Radio, Select, Spin, Typography } from 'antd';
import LangTabs, { type LangCode } from '@/components/LangTabs';
import { LANGS } from '@/components/LangTabs/langs';
import StatusTag from '@/components/StatusTag';
import {
  adminUserTotalText,
  confirmCountText,
  confirmRateText,
  genAnnouncementNo,
  getAnnouncement,
  newAnnouncementForm,
  saveAnnouncementDraft,
  submitAnnouncement,
  titleOf,
  TOUCHES,
  type Announcement,
  type AnnouncementForm,
} from '@/services/general-config/announcement';
import {
  ANNOUNCEMENT_STATUS,
  EDITOR_PLACEHOLDERS,
  TITLE_PLACEHOLDERS,
  TYPE_OPTIONS,
  type EditMode,
} from '../constants';
import { isBlankHtml } from '@/utils/html';
import { Card, Field } from '@/components/EditForm';
import RichEditor from '@/components/RichEditor';
import styles from '@/components/EditForm/index.module.css';

const TIME_FORMAT = 'YYYY-MM-DD HH:mm';

export interface EditTarget {
  mode: EditMode;
  /** edit / view：当前公告；copy：源公告；new：无 */
  id?: string;
}

interface Props {
  target: EditTarget;
  onBack: () => void;
  /** 保存 / 发布成功后回调（立即发布的提示与系统通知弹窗由页面处理） */
  onSaved: (row: Announcement) => void;
}

/**
 * 保存草稿与提交发布共用的必填校验。
 * 需求变更：标题按语言维护，各语言标题均必填；返回出错的语言，便于切到对应页签。
 * 新建公告（含基于此公告新建）时，失效时间为必填项。
 */
function validate(form: AnnouncementForm, isNew: boolean): { msg: string; lang?: LangCode } | null {
  const noTitle = LANGS.find((l) => !form.title[l.code].trim());
  if (noTitle) return { msg: `请填写${noTitle.label}版公告标题`, lang: noTitle.code };
  if (!form.touches.length) return { msg: '触达方式至少勾选一项' };
  if (isBlankHtml(form.content['zh-CN'])) {
    return { msg: '请填写简体中文版公告正文', lang: 'zh-CN' };
  }
  if (isNew && !form.exp?.trim()) return { msg: '请填写失效时间' };
  return null;
}

export default function EditView({ target, onBack, onSaved }: Props) {
  const { message, modal } = App.useApp();
  const { mode, id } = target;
  const readOnly = mode === 'view';
  const [form, setForm] = useState<AnnouncementForm>();
  const [row, setRow] = useState<Announcement>();
  const [no] = useState(() => genAnnouncementNo());
  const [lang, setLang] = useState<LangCode>('zh-CN');
  const [saving, setSaving] = useState<'draft' | 'submit'>();

  useEffect(() => {
    let alive = true;
    if (mode === 'new') {
      setForm(newAnnouncementForm());
      return;
    }
    getAnnouncement(id!).then((r) => {
      if (!alive) return;
      setRow(r);
      const { title, type, touches, force, once, effType, eff, exp, content } = r;
      setForm({
        title,
        type,
        touches,
        force,
        once,
        effType,
        // 立即生效发布的记录生效时间为「立即生效」，回填时给一个可选的默认时间
        eff: dayjs(eff).isValid() ? eff : dayjs().format(TIME_FORMAT),
        exp: exp === '长期有效' ? '' : exp,
        content,
      });
    });
    return () => {
      alive = false;
    };
  }, [mode, id]);

  if (!form) return <Spin style={{ display: 'block', margin: '80px auto' }} />;

  const set = (p: Partial<AnnouncementForm>) => setForm({ ...form, ...p });
  const isNewRecord = mode === 'new' || mode === 'copy';
  const titleText = {
    new: `新建公告 · ${no}`,
    edit: `编辑公告 · ${row?.no ?? ''}`,
    view: `公告详情 · ${row?.no ?? ''}`,
    copy: `基于此公告新建 · ${no}`,
  }[mode];

  const run = async (kind: 'draft' | 'submit') => {
    const err = validate(form, isNewRecord);
    if (err) {
      message.warning(err.msg);
      if (err.lang) setLang(err.lang);
      return;
    }
    if (kind === 'submit') {
      modal.confirm({
        title: '发布确认',
        width: 460,
        content: (
          <>
            <div>确定提交发布公告编号 {row?.no ?? no}？提交后将进入「待生效」状态，不再可编辑。</div>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {form.effType === 'IMMEDIATE'
                ? '本次为立即生效，提交后即刻向用户展示。'
                : `本次为定时生效，将于 ${form.eff} 自动向用户展示。`}
            </Typography.Text>
          </>
        ),
        okText: '确定发布',
        onOk: async () => {
          setSaving('submit');
          try {
            const saved = await submitAnnouncement(isNewRecord ? undefined : id, form);
            if (saved.status === 'SCHEDULED') message.success(`已提交发布，${saved.eff} 生效`);
            onSaved(saved);
            onBack();
          } finally {
            setSaving(undefined);
          }
        },
      });
      return;
    }
    setSaving(kind);
    try {
      const saved = await saveAnnouncementDraft(isNewRecord ? undefined : id, form);
      message.success(isNewRecord ? `已保存草稿：${titleOf(saved)}` : '已保存草稿');
      onSaved(saved);
      onBack();
    } finally {
      setSaving(undefined);
    }
  };

  return (
    <>
      <div className={styles.head}>
        <Typography.Link className={styles.back} onClick={onBack}>
          ← 返回列表
        </Typography.Link>
        <span className={styles.title}>{titleText}</span>
        <StatusTag
          variant="dot"
          lookup={ANNOUNCEMENT_STATUS}
          value={isNewRecord ? 'DRAFT' : row?.status}
        />
        {!readOnly && (
          <div className={styles.actions}>
            <Button size="small" loading={saving === 'draft'} onClick={() => run('draft')}>
              保存草稿
            </Button>
            <Button
              size="small"
              type="primary"
              loading={saving === 'submit'}
              onClick={() => run('submit')}
            >
              提交发布
            </Button>
          </div>
        )}
      </div>

      <Card title="基础信息">
        <div className={styles.grid}>
          <Field label="公告类型" required>
            <Select
              style={{ width: 200 }}
              options={TYPE_OPTIONS}
              value={form.type}
              disabled={readOnly}
              onChange={(type) => set({ type })}
            />
          </Field>
          <Field label="触达方式" required hint="可多选，至少勾选一项">
            <Checkbox.Group
              options={TOUCHES}
              value={form.touches}
              disabled={readOnly}
              onChange={(touches) => set({ touches: touches as string[] })}
            />
          </Field>
          <Field label="生效方式" required>
            <Radio.Group
              disabled={readOnly}
              value={form.effType}
              onChange={(e) => set({ effType: e.target.value })}
              options={[
                { label: '立即生效', value: 'IMMEDIATE' },
                { label: '定时生效', value: 'SCHEDULED' },
              ]}
            />
            {/* 原型为不可交互的展示框，重写为日期时间选择器 */}
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              format={TIME_FORMAT}
              allowClear={false}
              style={{ minWidth: 150 }}
              disabled={readOnly || form.effType === 'IMMEDIATE'}
              value={form.eff ? dayjs(form.eff) : null}
              onChange={(d) => d && set({ eff: d.format(TIME_FORMAT) })}
            />
          </Field>
          {/* 原型为无格式校验的文本框，重写为日期时间选择器 */}
          <Field
            label="失效时间"
            required={isNewRecord}
            hint={isNewRecord ? '必填，请设置公告失效时间' : '可空，为空则长期有效'}
          >
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              format={TIME_FORMAT}
              placeholder="如：2026-11-30 23:59"
              style={{ minWidth: 180 }}
              disabled={readOnly}
              value={form.exp ? dayjs(form.exp) : null}
              onChange={(d) => set({ exp: d ? d.format(TIME_FORMAT) : '' })}
            />
          </Field>
          <Field label="阅读设置" full>
            <div>
              <Checkbox
                checked={form.force}
                disabled={readOnly}
                onChange={(e) => set({ force: e.target.checked })}
              >
                强制阅读（须勾选「我已知晓」后方可关闭弹窗）
              </Checkbox>
              <Checkbox
                checked={form.once}
                disabled={readOnly}
                onChange={(e) => set({ once: e.target.checked })}
              >
                确认后不再弹出
              </Checkbox>
              <div className={styles.hint}>仅触达方式包含「系统通知」时生效</div>
            </div>
          </Field>
        </div>
      </Card>

      {/* 需求变更：原「公告正文」卡片改为「公告信息」，公告标题从基础信息移入各语言版本下 */}
      <Card title="公告信息">
        {/* 原型详情只能看简体中文，且只保存简体中文；这里各语言分别保存，详情也可切换语言查看 */}
        <LangTabs
          value={lang}
          onChange={setLang}
          hint="标题和正文按语言分别维护；正文至少填写简体中文版"
        />
        <div className={styles.grid}>
          <Field label="公告标题" required full>
            <Input
              maxLength={60}
              placeholder={TITLE_PLACEHOLDERS[lang]}
              value={form.title[lang]}
              disabled={readOnly}
              onChange={(e) => set({ title: { ...form.title, [lang]: e.target.value } })}
            />
          </Field>
        </div>
        <RichEditor
          key={lang}
          basic={lang !== 'zh-CN'}
          value={form.content[lang]}
          readOnly={readOnly}
          placeholder={EDITOR_PLACEHOLDERS[lang]}
          onChange={(html) => set({ content: { ...form.content, [lang]: html } })}
        />
      </Card>

      {readOnly && row && (
        <Card title="阅读数据">
          <div className={styles.grid}>
            {/* 需求变更：总用户数为当前后管用户总数，总用户数、确认人数只显示数字 */}
            <Field label="总用户数">{adminUserTotalText()}</Field>
            <Field label="确认率">{confirmRateText(row)}</Field>
            <Field label="确认人数">{confirmCountText(row)}</Field>
            <Field label="发布人">{row.publisher || '—'}</Field>
            <Field label="发布时间">{row.publishTime || '—'}</Field>
            <Field label="强制阅读">{row.force ? '已开启' : '未开启'}</Field>
          </div>
        </Card>
      )}
    </>
  );
}
