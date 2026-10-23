import { Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import type { PrivacyAuthRecord } from '@/services/customer/privacyAuth';
import { lookupText } from '@/utils/lookup';
import { NONE, SCENE } from './constants';

export function getColumns(
  onDetail: (row: PrivacyAuthRecord) => void,
): TableColumnsType<PrivacyAuthRecord> {
  return [
    { title: '客户ID', dataIndex: 'customerId', width: 120 },
    { title: '客户昵称', dataIndex: 'alias', width: 120, ellipsis: true },
    { title: '手机号', dataIndex: 'phone', width: 140 },
    { title: 'APP/PC', dataIndex: 'terminal', width: 100 },
    { title: '同意类型', dataIndex: 'consentType', width: 130 },
    { title: '版本号', dataIndex: 'version', width: 100 },
    // 授权来源两列（PRD §5.4）：其余来源字段在详情抽屉和导出文件中
    {
      title: '授权场景',
      dataIndex: 'scene',
      width: 150,
      ellipsis: true,
      render: (v: string) => lookupText(SCENE, v) || NONE,
    },
    {
      title: '客户端版本',
      dataIndex: 'clientVersion',
      width: 110,
      render: (v: string) => v || NONE,
    },
    // 末列前一列吸收余量
    { title: '同意时间', dataIndex: 'consentTime' },
    {
      title: '操作',
      key: 'action',
      width: 70,
      render: (_, r) => <Typography.Link onClick={() => onDetail(r)}>详情</Typography.Link>,
    },
  ];
}
