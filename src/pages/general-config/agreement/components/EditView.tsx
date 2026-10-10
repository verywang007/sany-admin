import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { App, Button, DatePicker, Input, Radio, Select, Spin, Tabs, Typography } from 'antd';
import LangTabs, { type LangCode } from '@/components/LangTabs';
import StatusTag from '@/components/StatusTag';
import DataTable from '@/components/DataTable';
import {
  getAgreementDetail,
  getCopyAgreementForm,
  getNewAgreementForm,
  saveAgreementDraft,
  submitAgreement,
  type AgreementForm,
  type AgreementLog,
  type AgreementRelease,
} from '@/services/general-config/agreement';
import {
  AGREEMENT_STATUS,
  MAIN_TABS,
  SITE_OPTIONS,
  type EditMode,
  type MainTab,
} from '../constants';
import { validateForSubmit } from '../validate';
import { Card, Field } from '@/components/EditForm';
import DocPanel from './DocPanel';
import PopupPanel from './PopupPanel';
import styles from '@/components/EditForm/index.module.css';

const TIME_FORMAT = 'YYYY-MM-DD HH:mm';
const LANG_HINT = '每个语言都必须填写标题与正文，缺失则不可发布';

export interface EditTarget {
  mode: EditMode;
  /** edit / view：当前记录；copy：源记录；new：无 */
  id?: string;
}

interface Props {
  target: EditTarget;
  onBack: () => void;
  /** 数据有变化（保存 / 发布）时通知列表刷新 */
  onSaved: () => void;
  /** 保存后切换为编辑该记录 */
  onSwitch: (target: EditTarget) => void;
}

const logColumns = [
  { title: '时间', dataIndex: 'time', width: 160 },
  { title: '操作人', dataIndex: 'operator', width: 100 },
  { title: '动作', dataIndex: 'action', width: 120 },
  { title: '备注', dataIndex: 'remark' },
];

export default function EditView({ target, onBack, onSaved, onSwitch }: Props) {
  const { message } = App.useApp();
  const { mode, id } = target;
  const readOnly = mode === 'view';
  const [form, setForm] = useState<AgreementForm>();
  const [source, setSource] = useState<AgreementRelease>();
  const [logs, setLogs] = useState<AgreementLog[]>([]);
  const [tab, setTab] = useState<MainTab>('privacy');
  const [langs, setLangs] = useState<Record<MainTab, LangCode>>({
    privacy: 'zh-CN',
    service: 'zh-CN',
    popup: 'zh-CN',
  });
  const [saving, setSaving] = useState<'draft' | 'submit'>();

  useEffect(() => {
    let alive = true;
    (async () => {
      if (mode === 'new') {
        const f = await getNewAgreementForm();
        if (alive) setForm(f);
        return;
      }
      const detail = await getAgreementDetail(id!);
      const f = mode === 'copy' ? await getCopyAgreementForm(id!) : detail.form;
      if (!alive) return;
      setForm(f);
      setSource(detail.release);
      setLogs(detail.logs);
      const first = detail.release.langs[0] ?? 'zh-CN';
      setLangs({ privacy: first, service: first, popup: first });
    })();
    return () => {
      alive = false;
    };
  }, [mode, id]);

  if (!form) return <Spin style={{ display: 'block', margin: '80px auto' }} />;

  const set = (p: Partial<AgreementForm>) => setForm({ ...form, ...p });
  const setContent = (p: Partial<AgreementForm['content']>) =>
    set({ content: { ...form.content, ...p } });
  const setLang = (t: MainTab, l: LangCode) => setLangs((s) => ({ ...s, [t]: l }));

  // 标题沿用原型：copy 模式显示源记录编号、状态与日志
  const titleText = {
    new: `新建协议版本 · ${form.version}`,
    edit: `编辑协议版本 · ${source?.version ?? form.version}`,
    view: `协议版本详情 · ${source?.version ?? form.version}`,
    copy: `基于此版本新建 · ${source?.version ?? ''}`,
  }[mode];
  const recordId = mode === 'edit' ? id : undefined;
  const remark = mode === 'copy' ? `由 ${source?.version} 复制而来` : '新建';

  const saveDraft = async () => {
    setSaving('draft');
    try {
      const row = await saveAgreementDraft(recordId, form, remark);
      message.success('已保存草稿');
      onSaved();
      // 新建 / 基于此版本新建：首次保存后转为编辑该草稿，后续保存不再重复建行
      if (!recordId) onSwitch({ mode: 'edit', id: row.id });
    } finally {
      setSaving(undefined);
    }
  };

  const submit = async () => {
    const err = validateForSubmit(form, langs);
    if (err) {
      setTab(err.tab);
      if (err.lang) setLang(err.tab, err.lang);
      message.error(err.message);
      return;
    }
    setSaving('submit');
    try {
      // 原型缺陷：copy 模式提交会把源（已发布 / 已失效）记录改为待生效。这里始终新建记录
      const row = await submitAgreement(recordId, form, remark);
      message.success(`已提交发布，${row.effectiveTime} 生效`);
      onSaved();
      onBack();
    } finally {
      setSaving(undefined);
    }
  };

  const tabItems = MAIN_TABS.map((t) => ({
    key: t.key,
    label: (
      <>
        {t.label}
        <span className={styles.tabStar}>*</span>
      </>
    ),
    children:
      t.key === 'popup' ? (
        <PopupPanel
          lang={langs.popup}
          onLangChange={(l) => setLang('popup', l)}
          popup={form.content.popup}
          readOnly={readOnly}
          onChange={(popup) => setContent({ popup })}
        />
      ) : (
        <>
          <LangTabs value={langs[t.key]} onChange={(l) => setLang(t.key, l)} hint={LANG_HINT} />
          <DocPanel
            kind={t.key}
            lang={langs[t.key]}
            docs={form.content[t.key]}
            readOnly={readOnly}
            onChange={(docs) => setContent({ [t.key]: docs })}
          />
        </>
      ),
  }));

  return (
    <>
      <div className={styles.head}>
        <Typography.Link className={styles.back} onClick={onBack}>
          ← 返回列表
        </Typography.Link>
        <span className={styles.title}>{titleText}</span>
        <StatusTag
          variant="dot"
          lookup={AGREEMENT_STATUS}
          value={mode === 'new' ? 'DRAFT' : source?.status}
        />
        {!readOnly && (
          <div className={styles.actions}>
            <Button size="small" loading={saving === 'draft'} onClick={saveDraft}>
              保存草稿
            </Button>
            <Button size="small" type="primary" loading={saving === 'submit'} onClick={submit}>
              提交发布
            </Button>
          </div>
        )}
      </div>

      <Card title="基础信息">
        <div className={styles.grid}>
          <Field label="发布编号" required>
            <Input
              value={form.version}
              disabled={readOnly}
              onChange={(e) => set({ version: e.target.value })}
            />
          </Field>
          {/* 原型提示为「可多选」，但实际为单选下拉，按原型实现；原型只读模式未禁用该下拉，这里修正 */}
          <Field label="适用站点" required hint="可多选，多站点共用同一份正文">
            <Select
              style={{ width: 200 }}
              value={form.site}
              options={SITE_OPTIONS}
              disabled={readOnly}
              onChange={(site) => set({ site })}
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
            <span title={form.effType === 'IMMEDIATE' ? '「立即生效」无需选择生效时间' : undefined}>
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format={TIME_FORMAT}
                allowClear={false}
                style={{ minWidth: 150 }}
                disabled={readOnly || form.effType === 'IMMEDIATE'}
                value={form.effectiveTime ? dayjs(form.effectiveTime) : null}
                onChange={(d) => d && set({ effectiveTime: d.format(TIME_FORMAT) })}
              />
            </span>
          </Field>
        </div>
      </Card>

      <Card title="协议内容">
        <Tabs
          className={styles.tabs}
          activeKey={tab}
          onChange={(k) => setTab(k as MainTab)}
          items={tabItems}
        />
      </Card>

      {mode !== 'new' && (
        <Card title="操作日志">
          <DataTable<AgreementLog> columns={logColumns} dataSource={logs} pagination={false} />
        </Card>
      )}
    </>
  );
}
