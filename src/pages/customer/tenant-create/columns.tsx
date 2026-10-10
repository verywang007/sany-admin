import { Button, type TableColumnsType } from 'antd';
import type { TenantCreateRecord } from '@/services/customer/tenantCreate';

export const getColumns = (
  onView: (r: TenantCreateRecord) => void,
): TableColumnsType<TenantCreateRecord> => [
  { title: '创建时间', dataIndex: 'applyTime', width: 160 },
  { title: '租户类型', dataIndex: 'tenantTypeDesc', width: 100 },
  { title: '租户ID', dataIndex: 'companyId', width: 100 },
  { title: '租户名称', dataIndex: 'companyName', width: 200, ellipsis: true },
  { title: '管理员登录账号', dataIndex: 'applyAccount', width: 150, ellipsis: true },
  { title: '企业注册号', dataIndex: 'registrationNumber', width: 180, ellipsis: true },
  { title: '国家/地区', dataIndex: 'countryDesc', width: 110 },
  { title: '操作人', dataIndex: 'approvalUserName', width: 160, ellipsis: true },
  { title: '备注说明', dataIndex: 'applicationDescription', ellipsis: true },
  {
    title: '操作',
    key: 'action',
    width: 120,
    align: 'center',
    fixed: 'right',
    render: (_, r) => (
      <Button type="link" size="small" onClick={() => onView(r)}>
        查看详情
      </Button>
    ),
  },
];
