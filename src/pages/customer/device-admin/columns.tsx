import { Button, Space, type TableColumnsType } from 'antd';
import { formatAdminPhone, type DeviceAdmin } from '@/services/customer/deviceAdmin';

interface Actions {
  onEdit: (r: DeviceAdmin) => void;
  onDelete: (r: DeviceAdmin) => void;
}

export const getColumns = ({ onEdit, onDelete }: Actions): TableColumnsType<DeviceAdmin> => [
  { title: '客户名称', dataIndex: 'crmCustomerName', width: 200, ellipsis: true },
  { title: '客户编码', dataIndex: 'crmCustomerNo', width: 120 },
  { title: '管理员名称', dataIndex: 'adminName', width: 160, ellipsis: true },
  { title: '管理员手机号', key: 'adminPhone', width: 160, render: (_, r) => formatAdminPhone(r) },
  { title: '管理员MySany账号', dataIndex: 'adminMysanyNo', ellipsis: true },
  {
    title: '操作',
    key: 'action',
    width: 130,
    align: 'center',
    fixed: 'right',
    render: (_, r) => (
      <Space size={0}>
        <Button type="link" size="small" onClick={() => onEdit(r)}>
          编辑
        </Button>
        <Button type="link" size="small" danger onClick={() => onDelete(r)}>
          删除
        </Button>
      </Space>
    ),
  },
];
