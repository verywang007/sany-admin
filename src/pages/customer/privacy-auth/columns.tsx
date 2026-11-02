import { Button, type TableColumnsType } from 'antd';
import type { PrivacyAuthRecord } from '@/services/customer/privacyAuth';
import { lookupText } from '@/utils/lookup';
import { maskName, maskPhone } from '@/utils/mask';
import { NONE, SCENE } from './constants';

/**
 * 列表只展示核心字段；昵称/手机号脱敏展示。
 * 其余来源字段（语言、客户端版本、IP、设备信息等）在行详情抽屉中查看。
 * onDetail 为「详情」按钮回调（整行点击也可打开同一抽屉）。
 */
export function getColumns(
  onDetail: (row: PrivacyAuthRecord) => void,
): TableColumnsType<PrivacyAuthRecord> {
  return [
    { title: '客户ID', dataIndex: 'customerId', width: 120 },
    {
      title: '客户昵称',
      dataIndex: 'alias',
      width: 120,
      ellipsis: true,
      render: (v: string) => maskName(v) || NONE,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 140,
      render: (v: string) => maskPhone(v) || NONE,
    },
    { title: 'APP/PC', dataIndex: 'terminal', width: 100 },
    { title: '同意类型', dataIndex: 'consentType', width: 130 },
    // 只有协议类（隐私协议、用户服务协议）有版本号，权限类显示占位
    { title: '版本号', dataIndex: 'version', width: 80, render: (v: string) => v || NONE },
    // 授权来源（PRD §5.4）：其余来源字段在行详情中
    {
      title: '授权场景',
      dataIndex: 'scene',
      width: 150,
      ellipsis: true,
      render: (v: string) => lookupText(SCENE, v) || NONE,
    },
    { title: '同意时间', dataIndex: 'consentTime', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, r) => (
        <Button
          type="link"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDetail(r);
          }}
        >
          详情
        </Button>
      ),
    },
  ];
}
