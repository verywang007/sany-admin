import { useCallback, useMemo, useRef, useState } from 'react';
import { App, Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageContainer from '@/components/PageContainer';
import SearchForm, { type SearchField, type SearchValues } from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import {
  fetchCancelApplyList,
  handleCancelApply,
  type CancelAction,
  type CancelApply,
  type CancelApplyQuery,
} from '@/services/customer/cancelApply';
import type { ListFetcher } from '@/types/common';
import { useTableQuery } from '@/utils/useTableQuery';
import { getColumns } from './columns';
import { COUNTRY_OPTIONS, STATUS_OPTIONS } from './constants';
import DetailModal from './components/DetailModal';
import ConfirmModal from './components/ConfirmModal';
import CancelTenantModal from '../tenant-cancel/components/CancelTenantModal';

const fields: SearchField[] = [
  { type: 'input', name: 'no', label: '申请单号', placeholder: '请输入申请单号' },
  { type: 'input', name: 'login', label: '昵称/登录用户名', placeholder: '请输入昵称或登录用户名' },
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
    name: 'source',
    label: '注销来源',
    options: [{ value: 'APP', label: 'App自助' }, { value: 'MANUAL', label: '后管代客' }],
    placeholder: '全部来源',
  },
  {
    type: 'select',
    name: 'country',
    label: '国家',
    options: COUNTRY_OPTIONS,
    placeholder: '全部国家',
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
  { type: 'input', name: 'operator', label: '操作人', placeholder: '请输入操作人' },
];

/** 客户管理 - 注销申请管理（手写原型迁移，业务见 docs/客户管理-账户注销-方案.md） */
export default function CancelApplyPage() {
  const { message } = App.useApp();

  // 记录最近一次查询的总数，用于「查询完成，共 n 条记录」提示
  const totalRef = useRef(0);
  const fetcher = useCallback<ListFetcher<CancelApply, CancelApplyQuery>>(async (q) => {
    const res = await fetchCancelApplyList(q);
    totalRef.current = res.total;
    return res;
  }, []);
  const { tableProps, query, search, reset, reload } = useTableQuery(fetcher);

  const [form] = Form.useForm();

  const doSearch = async (values: SearchValues) => {
    await search(values as CancelApplyQuery);
    message.info(`查询完成，共 ${totalRef.current} 条记录`);
  };

  const onReset = () => {
    reset();
    message.info('筛选条件已重置');
  };

  const [cancelUserOpen, setCancelUserOpen] = useState(false);
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
    message.success('操作成功，已记录操作日志');
  };

  return (
    <PageContainer title="注销申请管理">
      <SearchForm
        form={form}
        fields={fields}
        onSearch={doSearch}
        onReset={onReset}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setCancelUserOpen(true)}
        style={{ marginBottom: 12 }}
      >
        注销用户
      </Button>
      <DataTable
        {...tableProps}
        showIndex
        columns={columns}
        tableLayout="fixed"
        scroll={{ x: 1950 }}
        locale={{ emptyText: '暂无符合条件的注销申请' }}
      />
      <CancelTenantModal
        userMode
        open={cancelUserOpen}
        onClose={() => setCancelUserOpen(false)}
        onSuccess={() => { setCancelUserOpen(false); void reload(); }}
      />
      <DetailModal row={detail} onClose={() => setDetail(undefined)} />
      <ConfirmModal
        action={pendingAction?.action}
        onCancel={() => setPendingAction(undefined)}
        onOk={onConfirm}
      />
    </PageContainer>
  );
}
