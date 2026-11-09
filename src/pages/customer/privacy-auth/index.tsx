import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { App, Button, DatePicker, Form, Pagination } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import PageContainer from '@/components/PageContainer';
import SearchForm, { type SearchField } from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import {
  fetchPrivacyAuthList,
  normalizeFilters,
  type PrivacyAuthQuery,
  type PrivacyAuthRecord,
} from '@/services/customer/privacyAuth';
import { useTableQuery } from '@/utils/useTableQuery';
import { getColumns } from './columns';
import { lookupText } from '@/utils/lookup';
import { langLabel } from '@/components/LangTabs/langs';
import dayjs from 'dayjs';
import DetailDrawer from './DetailDrawer';
import {
  CONSENT_TYPE_OPTIONS,
  EMPTY_TEXT,
  isPcConsentType,
  isPcScene,
  PC_CONSENT_TYPE_OPTIONS,
  PC_SCENE_OPTIONS,
  SCENE,
  SCENE_OPTIONS,
  TERMINAL_OPTIONS,
} from './constants';
import { describeFilters } from './describe';
import styles from './index.module.css';

/** 同意类型、授权场景选项随终端联动：选 PC 时只保留 PC 端可能出现的值 */
const buildFields = (terminal: unknown): SearchField[] => [
  { type: 'input', name: 'customerId', label: '客户ID', placeholder: '请输入客户ID' },
  { type: 'input', name: 'alias', label: '客户昵称', placeholder: '请输入客户昵称' },
  { type: 'input', name: 'phone', label: '手机号', placeholder: '请输入手机号' },
  { type: 'select', name: 'terminal', label: 'APP/PC', options: TERMINAL_OPTIONS, placeholder: '' },
  {
    type: 'select',
    name: 'consentType',
    label: '同意类型',
    options: terminal === 'PC' ? PC_CONSENT_TYPE_OPTIONS : CONSENT_TYPE_OPTIONS,
    placeholder: '',
  },
  {
    type: 'select',
    name: 'scene',
    label: '授权场景',
    options: terminal === 'PC' ? PC_SCENE_OPTIONS : SCENE_OPTIONS,
    placeholder: '',
  },
  { type: 'input', name: 'version', label: '版本号', placeholder: '请输入版本号' },
  {
    type: 'custom',
    name: 'time',
    label: '时间区间',
    // 仅日期，可只填一端
    render: () => (
      <DatePicker.RangePicker
        style={{ width: '100%' }}
        allowEmpty={[true, true]}
        placeholder={['开始日期', '结束日期']}
        separator="~"
      />
    ),
  },
];

const initialValues = { terminal: '', consentType: '', scene: '' };

/** 导出 CSV 的列头（含全部来源字段；导出为明文，见 PRD §5.5） */
const EXPORT_HEADERS = [
  '客户ID', '客户昵称', '手机号', 'APP/PC', '同意类型', '版本号', '语言', '授权场景',
  '客户端版本', 'IP地址', '手机品牌', '手机型号', '手机类型',
  'PC操作系统', 'PC浏览器', '设备ID哈希', '同意时间', '服务端接收时间',
];

function toCsvCell(v: unknown): string {
  const s = v == null ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** 下载单个客户的授权记录为 CSV：仅真实记录，内容为明文（不脱敏） */
function downloadPrivacyAuthCsv(rows: PrivacyAuthRecord[], customerId: string) {
  const lines = [EXPORT_HEADERS.map(toCsvCell).join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.customerId,
        r.alias,
        r.phone,
        r.terminal,
        r.consentType,
        r.version,
        r.lang ? langLabel(r.lang) : '',
        lookupText(SCENE, r.scene),
        r.clientVersion,
        r.ip,
        r.phoneBrand,
        r.phoneModel,
        r.phoneType,
        r.pcOs,
        r.pcBrowser,
        r.deviceIdHash,
        r.consentTime,
        r.serverTime,
      ]
        .map(toCsvCell)
        .join(','),
    );
  }
  const csv = '﻿' + lines.join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `隐私授权记录_${customerId}_${dayjs().format('YYYYMMDD-HHmmss')}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** 隐私授权记录：先筛选后查询，进入页面不自动加载 */
export default function PrivacyAuth() {
  const { message } = App.useApp();
  const { tableProps, total, queried, query, search, reset } = useTableQuery(fetchPrivacyAuthList, {
    immediate: false,
  });
  const { current = 1, pageSize = 20, onChange } = tableProps.pagination;

  // 从「隐私/服务协议管理」点击同意人数跳转过来时带 ?version=，自动按该版本查询
  const [form] = Form.useForm();
  const terminal = Form.useWatch('terminal', form);
  const fields = useMemo(() => buildFields(terminal), [terminal]);
  // 切到 PC 时，已选的 APP 专属类型（位置、相机等）和场景（首次启动等）不再有效，清空回「全部」
  useEffect(() => {
    if (terminal !== 'PC') return;
    if (!isPcConsentType(form.getFieldValue('consentType'))) form.setFieldValue('consentType', '');
    if (!isPcScene(form.getFieldValue('scene'))) form.setFieldValue('scene', '');
  }, [terminal, form]);
  const columns = useMemo(() => getColumns((r) => setDetail(r)), []);
  const [detail, setDetail] = useState<PrivacyAuthRecord | null>(null);
  const [exporting, setExporting] = useState(false);
  const [searchParams] = useSearchParams();
  const version = searchParams.get('version');
  useEffect(() => {
    if (!version) return;
    form.resetFields();
    form.setFieldValue('version', version);
    search(form.getFieldsValue(true) as PrivacyAuthQuery);
    // 只响应链接参数的变化
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);
  const from = total > 0 ? (current - 1) * pageSize + 1 : 1;
  const to = Math.min(current * pageSize, total);

  /** 导出：仅允许单个客户（按客户ID），不支持批量；仅含真实记录，内容为明文不脱敏 */
  const onExport = async () => {
    const values = form.getFieldsValue(true) as PrivacyAuthQuery;
    const cid = (values.customerId ?? '').trim();
    if (!cid) {
      message.warning('请先在「客户ID」填入单个客户后再导出，不允许批量导出');
      return;
    }
    setExporting(true);
    try {
      const res = await fetchPrivacyAuthList({ ...values, page: 1, pageSize: 99999 });
      // 仅保留真实记录（id 以 p 开头），排除「查无结果时现场合成」的演示数据
      const rows = res.list.filter((r) => r.id.startsWith('p'));
      if (!rows.length) {
        message.info(`客户 ${cid} 无授权记录可导出`);
        return;
      }
      // 严格保证只导出单个人：客户ID 模糊匹配可能命中多个客户
      if (new Set(rows.map((r) => r.customerId)).size > 1) {
        message.warning('客户ID 匹配到多个客户，请填写完整的单个客户ID后再导出');
        return;
      }
      downloadPrivacyAuthCsv(rows, cid);
      message.success(`已导出客户 ${cid} 的 ${rows.length} 条授权记录`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageContainer
      title="隐私授权记录"
      extra={
        <Button
          type="primary"
          size="small"
          icon={<ExportOutlined />}
          loading={exporting}
          onClick={onExport}
        >
          导出
        </Button>
      }
    >
      <SearchForm
        form={form}
        fields={fields}
        columns={4}
        collapsedRows={2}
        labelWidth={84}
        initialValues={initialValues}
        onSearch={(v) => search(v as PrivacyAuthQuery)}
        onReset={reset}
      />
      {queried && (
        <div className={styles.hint}>
          共查询到 <b>{total}</b> 条授权记录
          <span className={styles.desc}>{describeFilters(normalizeFilters(query))}</span>
        </div>
      )}
      <DataTable
        {...tableProps}
        pagination={false}
        columns={columns}
        locale={{ emptyText: queried ? EMPTY_TEXT.none : EMPTY_TEXT.idle }}
      />
      {/* 分页条常驻：空数据时显示「1 - 0 / 0」且翻页按钮全部禁用 */}
      <div className={styles.pager}>
        <Pagination
          size="small"
          current={current}
          pageSize={pageSize}
          total={total}
          disabled={!queried}
          showSizeChanger
          pageSizeOptions={[10, 20, 50, 100]}
          showTotal={() => `${from} - ${to} / ${total}`}
          onChange={onChange}
        />
      </div>
      <DetailDrawer record={detail} onClose={() => setDetail(null)} />
    </PageContainer>
  );
}
