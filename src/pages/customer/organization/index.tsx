import { useMemo, useState } from 'react';
import { Button } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import PageContainer from '@/components/PageContainer';
import SearchForm, { type SearchField } from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import { fetchOrganizationList, type Organization } from '@/services/customer/organization';
import { useTableQuery } from '@/utils/useTableQuery';
import { buildColumns } from './columns';
import CreateModal from './components/CreateModal';
import ManageDrawer from './components/ManageDrawer';

const fields: SearchField[] = [
  { type: 'input', name: 'crmCustomerNo', label: '组织关联客户编码', placeholder: '' },
  { type: 'input', name: 'organizationName', label: '组织名称', placeholder: '' },
];

/** 组织管理（页头原文为「客户组织管理」） */
export default function OrganizationPage() {
  const { tableProps, search, reset, reload } = useTableQuery(fetchOrganizationList);
  const [creating, setCreating] = useState(false);
  const [managing, setManaging] = useState<Organization>();
  const columns = useMemo(() => buildColumns(setManaging), []);

  return (
    <PageContainer title="客户组织管理">
      <SearchForm fields={fields} columns={3} labelWidth={130} onSearch={search} onReset={reset} />
      <div style={{ marginBottom: 12, textAlign: 'right' }}>
        <Button
          type="link"
          icon={<PlusSquareOutlined />}
          style={{ paddingInline: 0 }}
          onClick={() => setCreating(true)}
        >
          创建组织
        </Button>
      </div>
      <DataTable<Organization> {...tableProps} columns={columns} />
      <CreateModal open={creating} onClose={() => setCreating(false)} onCreated={reload} />
      <ManageDrawer org={managing} onClose={() => setManaging(undefined)} />
    </PageContainer>
  );
}
