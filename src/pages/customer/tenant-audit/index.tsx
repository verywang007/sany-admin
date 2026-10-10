import { Button, Empty, Tabs } from 'antd';
import PageContainer from '@/components/PageContainer';
import SearchForm, { type SearchField } from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import { fetchTenantApplyList } from '@/services/customer/tenantAudit';
import { useTableQuery } from '@/utils/useTableQuery';
import { usePrototypeActions } from '@/utils/feedback';
import { columns } from './columns';

const fields: SearchField[] = [
  { type: 'dateRange', name: 'time', label: '申请时间范围', placeholder: ['请选择', '请选择'] },
  { type: 'input', name: 'applyAccount', label: '申请人手机号', placeholder: '' },
  { type: 'input', name: 'applyName', label: '申请人姓名', placeholder: '' },
  { type: 'input', name: 'companyName', label: '企业名称', placeholder: '' },
];

function EnterpriseApplyList() {
  const { tableProps, search, reset } = useTableQuery(fetchTenantApplyList);
  const { exportData } = usePrototypeActions();
  return (
    <>
      <SearchForm fields={fields} alwaysShowMore labelWidth={110} onSearch={search} onReset={reset} />
      <div style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={() => exportData('申请记录')}>
          导出
        </Button>
      </div>
      <DataTable {...tableProps} columns={columns} />
    </>
  );
}

/** 租户审核（页头原文为「租户管理」） */
export default function TenantAudit() {
  return (
    <PageContainer title="租户管理">
      <Tabs
        items={[
          { key: 'enterprise', label: '企业客户申请记录', children: <EnterpriseApplyList /> },
          {
            key: 'agent',
            label: '代理商申请审批',
            // 原型快照中该页签内容为空
            children: <Empty description="原型暂未提供代理商申请审批内容" />,
          },
        ]}
      />
    </PageContainer>
  );
}
