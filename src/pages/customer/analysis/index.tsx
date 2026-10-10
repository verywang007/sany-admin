import { useMemo } from 'react';
import { Button, Space } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import PageContainer from '@/components/PageContainer';
import SearchForm, { type SearchField } from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import { fetchCustomerStatList } from '@/services/customer/customerAnalysis';
import { useTableQuery } from '@/utils/useTableQuery';
import { usePrototypeActions } from '@/utils/feedback';
import { getColumns } from './columns';
import CountryLov from './components/CountryLov';

const fields: SearchField[] = [
  { type: 'custom', name: 'countryObj', label: '国家', render: () => <CountryLov /> },
  { type: 'dateRange', name: 'time', label: '选择时间', showTime: true, placeholder: ['', ''] },
  {
    type: 'select',
    name: 'authStatus',
    label: '认证状态',
    placeholder: '',
    // 推断：原型下拉未展开
    options: [
      { label: '已认证', value: 'CERTIFIED' },
      { label: '未认证', value: 'UNCERTIFIED' },
    ],
  },
];

/** 客户分析（客户管理下，按国家&地区统计客户数） */
export default function CustomerAnalysis() {
  const { tableProps, search, reset } = useTableQuery(fetchCustomerStatList, {
    defaultPageSize: 10,
  });
  const { exportData } = usePrototypeActions();
  const columns = useMemo(() => getColumns(exportData), [exportData]);

  return (
    <PageContainer title="客户分析">
      <SearchForm fields={fields} columns={3} labelWidth={80} onSearch={search} onReset={reset} />
      <Space size={5} style={{ marginBottom: 12 }}>
        <Button
          type="link"
          icon={<ExportOutlined />}
          style={{ padding: 0 }}
          onClick={() => exportData('新增客户明细')}
        >
          导出新增客户明细
        </Button>
        <Button
          type="link"
          icon={<ExportOutlined />}
          style={{ padding: 0 }}
          onClick={() => exportData('总客户明细')}
        >
          导出总客户明细
        </Button>
        <Button
          type="link"
          icon={<ExportOutlined />}
          style={{ padding: 0 }}
          onClick={() => exportData('客户统计')}
        >
          导出
        </Button>
      </Space>
      <DataTable {...tableProps} columns={columns} />
    </PageContainer>
  );
}
