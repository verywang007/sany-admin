import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { App, Button, Checkbox, DatePicker, Input, Radio, Select, Spin, Typography } from 'antd';
import LangTabs, { type LangCode } from '@/components/LangTabs';
import StatusTag from '@/components/StatusTag';
import {
  genAnnouncementNo,
  getAnnouncement,
  newAnnouncementForm,
  saveAnnouncementDraft,
  submitAnnouncement,
  TOUCHES,
  type Announcement,
  type AnnouncementForm,
} from '@/services/general-config/announcement';
import {
  ANNOUNCEMENT_STATUS,
  EDITOR_PLACEHOLDERS,
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

/** 保存草稿与提交发布共用的必填校验（同原型） */
function validate(form: AnnouncementForm) {
  if (!form.title.trim()) return '请填写公告标题';
  if (!form.touches.length) return '触达方式至少勾选一项';
  if (isBlankHtml(form.content['zh-CN'])) return '请填写简体中文版公告正文';
  return null;
}

export default function EditView({ target, onBack, onSaved }: Props) {
  const { message } = App.useApp();
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
    const err = validate(form);
    if (err) {
      message.warning(err);
      return;
    }
    setSaving(kind);
    try {
      const recordId = isNewRecord ? undefined : id;
      if (kind === 'draft') {
        const saved = await saveAnnouncementDraft(recordId, form);
        message.success(isNewRecord ? `已保存草稿：${saved.title}` : '已保存草稿');
        onSaved(saved);
      } else {
        const saved = await submitAnnouncement(recordId, form);
        if (saved.status === 'SCHEDULED') message.success(`已提交发布，${saved.eff} 生效`);
        onSaved(saved);
      }
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
          <Field label="公告标题" required full>
            <Input
              maxLength={60}
              placeholder="请输入公告标题（不超过 60 字）"
              value={form.title}
              disabled={readOnly}
              onChange={(e) => set({ title: e.target.value })}
            />
          </Field>
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
          <Field label="失效时间" hint="可空，为空则长期有效">
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

      <Card title="公告正文">
        {/* 原型详情只能看简体中文，且只保存简体中文；这里各语言分别保存，详情也可切换语言查看 */}
        <LangTabs
          value={lang}
          onChange={setLang}
          hint="正文按语言分别维护，发布前至少填写简体中文版正文"
        />
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
        <Card title="触达与阅读数据">
          <div className={styles.grid}>
            <Field label="触达人数">{row.reach || '—'}</Field>
            <Field label="阅读率">{row.read || '—'}</Field>
            <Field label="确认人数">{row.confirm || '—'}</Field>
            <Field label="发布人">{row.publisher || '—'}</Field>
            <Field label="发布时间">{row.publishTime || '—'}</Field>
            <Field label="强制阅读">{row.force ? '已开启' : '未开启'}</Field>
          </div>
        </Card>
      )}
    </>
  );
}
