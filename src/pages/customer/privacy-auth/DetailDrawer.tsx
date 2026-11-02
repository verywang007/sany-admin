import { Descriptions, Drawer } from 'antd';
import { langLabel } from '@/components/LangTabs/langs';
import type { PrivacyAuthRecord } from '@/services/customer/privacyAuth';
import { lookupText } from '@/utils/lookup';
import { maskIp, maskName, maskPhone } from '@/utils/mask';
import { NONE, SCENE } from './constants';

interface Props {
  record?: PrivacyAuthRecord | null;
  onClose: () => void;
}

/** 行详情：展示全部字段；昵称/手机号/IP 脱敏，不展示明文 */
export default function DetailDrawer({ record, onClose }: Props) {
  const app = record?.terminal === 'APP';
  return (
    <Drawer open={!!record} title="隐私授权详情" width={680} onClose={onClose} destroyOnHidden>
      {record && (
        <>
          <Descriptions column={2} size="small" bordered style={{ marginBottom: 16 }} title="基础信息">
            <Descriptions.Item label="客户ID" span={2}>
              {record.customerId}
            </Descriptions.Item>
            <Descriptions.Item label="客户昵称">{maskName(record.alias) || NONE}</Descriptions.Item>
            <Descriptions.Item label="手机号">{maskPhone(record.phone) || NONE}</Descriptions.Item>
            <Descriptions.Item label="APP/PC">{record.terminal}</Descriptions.Item>
            <Descriptions.Item label="同意类型">{record.consentType}</Descriptions.Item>
            <Descriptions.Item label="版本号">{record.version || NONE}</Descriptions.Item>
            <Descriptions.Item label="语言">{record.lang ? langLabel(record.lang) : NONE}</Descriptions.Item>
            <Descriptions.Item label="授权场景">{lookupText(SCENE, record.scene) || NONE}</Descriptions.Item>
            <Descriptions.Item label="同意时间" span={2}>
              {record.consentTime || NONE}
            </Descriptions.Item>
            <Descriptions.Item label="服务端接收时间" span={2}>
              {record.serverTime || NONE}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions column={2} size="small" bordered style={{ marginBottom: 16 }} title="设备与环境">
            {app ? (
              <>
                <Descriptions.Item label="手机品牌">{record.phoneBrand || NONE}</Descriptions.Item>
                <Descriptions.Item label="手机型号">{record.phoneModel || NONE}</Descriptions.Item>
                <Descriptions.Item label="手机类型" span={2}>
                  {record.phoneType || NONE}
                </Descriptions.Item>
              </>
            ) : (
              <>
                <Descriptions.Item label="PC 操作系统">{record.pcOs || NONE}</Descriptions.Item>
                <Descriptions.Item label="PC 浏览器">{record.pcBrowser || NONE}</Descriptions.Item>
              </>
            )}
            <Descriptions.Item label="客户端版本" span={2}>
              {record.clientVersion || NONE}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions column={1} size="small" bordered title="网络与举证">
            <Descriptions.Item label="IP 地址">{maskIp(record.ip) || NONE}</Descriptions.Item>
            <Descriptions.Item label="IP 归属地">{record.ipRegion || NONE}</Descriptions.Item>
            <Descriptions.Item label="设备ID哈希">{record.deviceIdHash || NONE}</Descriptions.Item>
            <Descriptions.Item label="内容哈希">{record.contentHash || NONE}</Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Drawer>
  );
}
