import type { TableColumnsType } from 'antd';
import type { PrivacyAuthRecord } from '@/services/customer/privacyAuth';

export const columns: TableColumnsType<PrivacyAuthRecord> = [
  { title: '客户ID', dataIndex: 'customerId', width: 120 },
  { title: '客户昵称', dataIndex: 'alias', width: 120, ellipsis: true },
  { title: '手机号', dataIndex: 'phone', width: 140 },
  { title: 'APP/PC', dataIndex: 'terminal', width: 100 },
  { title: '同意类型', dataIndex: 'consentType', width: 130 },
  { title: '版本号', dataIndex: 'version', width: 100 },
  // 末列吸收余量
  { title: '同意时间', dataIndex: 'consentTime' },
];
