import { useMemo, useState } from 'react';
import { Button, Space } from 'antd';
import { CloudUploadOutlined, PlusSquareOutlined } from '@ant-design/icons';
import PageContainer from '@/components/PageContainer';
import SearchForm, { type SearchField } from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import { fetchTenantCreateList, type TenantCreateRecord } from '@/services/customer/tenantCreate';
import { useTableQuery } from '@/utils/useTableQuery';
import { usePrototypeActions } from '@/utils/feedback';
import { getColumns } from './columns';
import { TENANT_TYPE_OPTIONS } from './constants';
import CreateTenantModal from './components/CreateTenantModal';
import TenantDetailModal from './components/TenantDetailModal';

const fields: SearchField[] = [
  { type: 'dateRange', name: 'times', label: '创建时间', placeholder: ['请选择', '请选择'] },
  // placeholder「请选择系统」为原型原文
  {
    type: 'select',
    name: 'tenantType',
    label: '租户类型',
    options: TENANT_TYPE_OPTIONS,
    placeholder: '请选择系统',
  },
  { type: 'input', name: 'companyName', label: '租户名称', placeholder: '请输入' },
];

/** 直接创建租户 */
export default function TenantCreate() {
  const { tableProps, search, reset, reload } = useTableQuery(fetchTenantCreateList);
  const { exportData } = usePrototypeActions();
  const [createOpen, setCreateOpen] = useState(false);
  const [detail, setDetail] = useState<TenantCreateRecord | null>(null);
  const columns = useMemo(() => getColumns(setDetail), []);

  return (
    <PageContainer title="直接创建租户">
      <SearchForm
        fields={fields}
        columns={3}
        labelWidth={80}
        alwaysShowMore
        onSearch={search}
        onReset={reset}
      />
      <Space style={{ marginBottom: 12 }}>
        <Button
          color="primary"
          variant="text"
          icon={<PlusSquareOutlined />}
          onClick={() => setCreateOpen(true)}
        >
          创建租户
        </Button>
        <Button icon={<CloudUploadOutlined />} onClick={() => exportData('租户记录')}>
          导出记录
        </Button>
      </Space>
      <DataTable {...tableProps} showIndex columns={columns} />
      <CreateTenantModal
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onSuccess={() => {
          setCreateOpen(false);
          reload();
        }}
      />
      <TenantDetailModal record={detail} onClose={() => setDetail(null)} />
    </PageContainer>
  );
}
