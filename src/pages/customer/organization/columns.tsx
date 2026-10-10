import { Button, type TableColumnsType } from 'antd';
import type { Organization } from '@/services/customer/organization';

export const buildColumns = (
  onManage: (row: Organization) => void,
): TableColumnsType<Organization> => [
  { title: '组织名称', dataIndex: 'organizationName', width: 260, ellipsis: true },
  { title: '组织关联客户编码', dataIndex: 'crmCustomerNo', width: 160 },
  // 原型表头为「成员数量,」，末尾英文逗号为多语言配置瑕疵，已去掉
  { title: '成员数量', dataIndex: 'orgUserSize', width: 100, align: 'right' },
  { title: '创建时间', dataIndex: 'creationDate' },
  {
    title: '操作',
    key: 'action',
    width: 200,
    align: 'center',
    fixed: 'right',
    render: (_v, r) => (
      <Button type="link" size="small" onClick={() => onManage(r)}>
        管理组织
      </Button>
    ),
  },
];
