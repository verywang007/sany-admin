import type { TableColumnsType } from 'antd';
import type { TenantApply } from '@/services/customer/tenantAudit';

export const columns: TableColumnsType<TenantApply> = [
  { title: '申请编号', dataIndex: 'applyNo', width: 160 },
  { title: '申请时间', dataIndex: 'applyTime', width: 160 },
  { title: '申请人手机号', dataIndex: 'applyAccount', width: 130 },
  { title: '申请人姓名', dataIndex: 'applyName', width: 160, ellipsis: true },
  { title: 'D365客户编码', dataIndex: 'customerCode', width: 120 },
  { title: '企业名称', dataIndex: 'companyName', width: 220, ellipsis: true },
  { title: '企业注册号', dataIndex: 'registrationNumber', width: 160, ellipsis: true },
  { title: '联系人姓名', dataIndex: 'contactName', width: 220, ellipsis: true },
  { title: '联系人手机号', dataIndex: 'contactPhone', width: 130 },
  { title: '转换完成时间', dataIndex: 'approvalTime', width: 160 },
];
