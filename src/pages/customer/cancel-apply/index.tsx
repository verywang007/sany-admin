import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { App, Button, Form } from 'antd';
import { ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import PageContainer, { PageCard } from '@/components/PageContainer';
import SearchForm, { type SearchField, type SearchValues } from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import type { AccountCancelStatus } from '@/constants/accountCancel';
import {
  fetchCancelApplyList,
  fetchCancelApplyStats,
  handleCancelApply,
  type CancelAction,
  type CancelApply,
  type CancelApplyQuery,
  type CancelApplyStats,
} from '@/services/customer/cancelApply';
import type { ListFetcher } from '@/types/common';
import { useTableQuery } from '@/utils/useTableQuery';
import { usePrototypeActions } from '@/utils/feedback';
import { getColumns } from './columns';
import { COUNTRY_OPTIONS, STATUS_OPTIONS, cssVars } from './constants';
import StatCards from './components/StatCards';
import DetailModal from './components/DetailModal';
import ConfirmModal from './components/ConfirmModal';
import styles from './index.module.css';

const fields: SearchField[] = [
  { type: 'input', name: 'no', label: '申请单号', placeholder: '请输入申请单号' },
  { type: 'input', name: 'login', label: '登录用户名', placeholder: '请输入登录用户名' },
  { type: 'input', name: 'phone', label: '联系电话', placeholder: '请输入联系电话' },
  {
    type: 'select',
    name: 'status',
    label: '注销状态',
    options: STATUS_OPTIONS,
    placeholder: '全部状态',
  },
  {
    type: 'select',
    name: 'country',
    label: '国家/地区',
    options: COUNTRY_OPTIONS,
    placeholder: '全部国家/地区',
  },
  {
    type: 'dateRange',
    name: 'applyTime',
    label: '申请时间',
    placeholder: ['开始日期', '结束日期'],
  },
  {
    type: 'dateRange',
    name: 'finishTime',
    label: '完成时间',
    placeholder: ['开始日期', '结束日期'],
  },
  { type: 'input', name: 'handler', label: '当前处理人', placeholder: '请输入处理人' },
];

/** 客户管理 - 注销申请管理（手写原型迁移，业务见 docs/客户管理-账户注销-方案.md） */
export default function CancelApplyPage() {
  const { message } = App.useApp();
  const { exportData } = usePrototypeActions();

  // 记录最近一次查询的总数，用于「查询完成，共 n 条记录」提示
  const totalRef = useRef(0);
  const fetcher = useCallback<ListFetcher<CancelApply, CancelApplyQuery>>(async (q) => {
    const res = await fetchCancelApplyList(q);
    totalRef.current = res.total;
    return res;
  }, []);
  const { tableProps, total, query, search, reset, reload } = useTableQuery(fetcher);

  const [stats, setStats] = useState<CancelApplyStats>();
  const loadStats = useCallback(() => fetchCancelApplyStats().then(setStats), []);
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // 页面持有查询表单实例：点统计卡时直接写入「注销状态」，不丢失其他未提交的输入
  const [form] = Form.useForm();
  const [activeStatus, setActiveStatus] = useState<string>();

  const doSearch = async (values: SearchValues) => {
    setActiveStatus(values.status as string | undefined);
    await search(values as CancelApplyQuery);
    message.info(`查询完成，共 ${totalRef.current} 条记录`);
  };

  const onCardSelect = (status: AccountCancelStatus) => {
    form.setFieldValue('status', status);
    doSearch(form.getFieldsValue(true));
  };

  const onReset = () => {
    setActiveStatus(undefined);
    reset();
    message.info('筛选条件已重置');
  };

  const [detail, setDetail] = useState<CancelApply>();
  const [pendingAction, setPendingAction] = useState<{ row: CancelApply; action: CancelAction }>();

  const columns = useMemo(
    () => getColumns(setDetail, (row, action) => setPendingAction({ row, action })),
    [],
  );

  const onConfirm = async (note: string) => {
    if (!pendingAction) return;
    try {
      await handleCancelApply(pendingAction.row.id, pendingAction.action, note);
    } catch (e) {
      message.error((e as Error).message);
      return;
    }
    setPendingAction(undefined);
    setDetail(undefined);
    // 按当前条件重新查询并回到第 1 页（不弹查询提示）
    search(query as CancelApplyQuery);
    loadStats();
    message.success('操作成功，已记录操作日志');
  };

  return (
    <PageContainer title="注销申请管理" card={false}>
      <div style={cssVars}>
        <StatCards stats={stats} active={activeStatus} onSelect={onCardSelect} />
      </div>
      <PageCard>
        <SearchForm
          form={form}
          fields={fields}
          collapsedRows={2}
          labelWidth={86}
          onSearch={doSearch}
          onReset={onReset}
        />
      </PageCard>
      <PageCard>
        <div className={styles.toolbar} style={cssVars}>
          <span className={styles.toolbarTitle}>注销申请列表</span>
          <span className={styles.count}>共 {total} 条记录</span>
          <div className={styles.toolbarExtra}>
            {/* 原型为前端生成 CSV；改为统一的导出提示 */}
            <Button
              size="small"
              icon={<ExportOutlined />}
              onClick={() => exportData('注销申请列表')}
            >
              导出
            </Button>
            {/* 原型刷新时会同步 App 端 localStorage 数据，迁移后不再保留，仅重新拉取 */}
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={async () => {
                await Promise.all([reload(), loadStats()]);
                message.info('列表已刷新');
              }}
            >
              刷新
            </Button>
          </div>
        </div>
        <div style={cssVars}>
          <DataTable
            {...tableProps}
            columns={columns}
            tableLayout="fixed"
            scroll={{ x: 1500 }}
            locale={{ emptyText: '暂无符合条件的注销申请' }}
          />
        </div>
      </PageCard>
      <DetailModal
        row={detail}
        onClose={() => setDetail(undefined)}
        onAction={(row, action) => setPendingAction({ row, action })}
      />
      <ConfirmModal
        action={pendingAction?.action}
        onCancel={() => setPendingAction(undefined)}
        onOk={onConfirm}
      />
    </PageContainer>
  );
}
