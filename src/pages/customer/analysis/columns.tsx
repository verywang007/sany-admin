import { Button, Space, type TableColumnsType } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import type { CustomerStat } from '@/services/customer/customerAnalysis';

export const getColumns = (onExport: (name: string) => void): TableColumnsType<CustomerStat> => [
  { title: '国家&地区', dataIndex: 'country', width: 160, ellipsis: true },
  // 数字列左对齐，与原型一致
  { title: '新增客户数', dataIndex: 'increaseNumber', width: 110 },
  { title: '总客户数', dataIndex: 'totalNumber' },
  {
    title: '操作',
    key: 'action',
    width: 250,
    align: 'center',
    render: (_, r) => (
      <Space size={10}>
        <Button
          type="link"
          size="small"
          icon={<ExportOutlined />}
          onClick={() => onExport(`${r.country}新增客户明细`)}
        >
          导出新增客户明细
        </Button>
        <Button
          type="link"
          size="small"
          icon={<ExportOutlined />}
          onClick={() => onExport(`${r.country}总客户明细`)}
        >
          导出总客户明细
        </Button>
      </Space>
    ),
  },
];
