import type { TableColumnsType } from 'antd';
import { langLabel } from '@/components/LangTabs/langs';
import type { PrivacyAuthRecord } from '@/services/customer/privacyAuth';
import { lookupText } from '@/utils/lookup';
import { NONE, SCENE } from './constants';

export function getColumns(): TableColumnsType<PrivacyAuthRecord> {
  return [
    { title: '客户ID', dataIndex: 'customerId', width: 120 },
    { title: '客户昵称', dataIndex: 'alias', width: 120, ellipsis: true },
    { title: '手机号', dataIndex: 'phone', width: 140 },
    { title: 'APP/PC', dataIndex: 'terminal', width: 100 },
    { title: '同意类型', dataIndex: 'consentType', width: 130 },
    // 只有协议类（隐私协议、用户服务协议）有版本号，权限类显示占位
    { title: '版本号', dataIndex: 'version', width: 80, render: (v: string) => v || NONE },
    // 协议类为协议语言，权限类为授权时的界面语言
    {
      title: '语言',
      dataIndex: 'lang',
      width: 120,
      ellipsis: true,
      render: (v: string) => (v ? langLabel(v) : NONE),
    },
    // 授权来源（PRD §5.4）：其余来源字段在导出文件中
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
    {
      title: 'IP 地址',
      dataIndex: 'ip',
      width: 140,
      render: (v: string) => v || NONE,
    },
    // 末列吸收余量
    { title: '同意时间', dataIndex: 'consentTime' },
  ];
}
