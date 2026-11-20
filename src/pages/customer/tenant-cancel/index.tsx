import { useState } from 'react';
import { Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageContainer from '@/components/PageContainer';
import SearchForm, { type SearchField } from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import { fetchTenantCancelList } from '@/services/customer/tenantCancel';
import { useTableQuery } from '@/utils/useTableQuery';
import CancelTenantModal from './components/CancelTenantModal';

const fields: SearchField[] = [
  { type: 'input', name: 'userId', label: '用户ID' },
  { type: 'input', name: 'identity', label: '昵称/登录用户名' },
  { type: 'input', name: 'phone', label: '手机号码' },
  { type: 'input', name: 'email', label: '邮箱' },
  { type: 'input', name: 'operator', label: '操作人' },
  { type: 'dateRange', name: 'times', label: '注销时间', placeholder: ['开始时间', '结束时间'] },
];
export default function TenantCancel() {
  const { tableProps, search, reset, reload } = useTableQuery(fetchTenantCancelList);
  const [open, setOpen] = useState(false);
  return (
    <PageContainer title="直接注销租户">
      <SearchForm fields={fields} onSearch={search} onReset={reset} />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
        style={{ marginBottom: 12 }}
      >
        注销租户
      </Button>
      <DataTable
        {...tableProps}
        showIndex
        columns={[
          { title: '注销记录号', dataIndex: 'id', width: 180 },
          { title: '用户ID', dataIndex: 'userId', width: 130 },
          { title: '客户编号', dataIndex: 'tenantId', width: 130 },
          { title: '姓名', dataIndex: 'contact', width: 140 },
          { title: '手机号码', dataIndex: 'phone', width: 140 },
          { title: '邮箱', dataIndex: 'email', width: 240 },
          { title: '昵称', dataIndex: 'nickname', width: 140 },
          { title: '用户名', dataIndex: 'username', width: 160 },
          { title: '验证码验证时间', dataIndex: 'verifiedAt', width: 180 },
          { title: '注销原因', dataIndex: 'reason', width: 280 },
          { title: '状态', dataIndex: 'status', width: 150, render: (value) => <Tag>{value}</Tag> },
          { title: '操作人', dataIndex: 'operator', width: 140 },
          { title: '注销时间', dataIndex: 'createdAt', width: 180 },
        ]}
      />
      <CancelTenantModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          reload();
        }}
      />
    </PageContainer>
  );
}
