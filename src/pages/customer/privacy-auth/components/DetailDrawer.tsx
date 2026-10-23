import { Alert, Descriptions, Drawer, Typography } from 'antd';
import { langLabel } from '@/components/LangTabs/langs';
import { PC_TYPES, SOURCE_SINCE } from '@/mock/customer/privacyAuth';
import type { PrivacyAuthRecord } from '@/services/customer/privacyAuth';
import { lookupText } from '@/utils/lookup';
import { maskIp, NONE, SCENE } from '../constants';
import styles from '../index.module.css';

interface Props {
  row?: PrivacyAuthRecord;
  onClose: () => void;
}

/** 哈希值较长，展示前 16 位，可复制完整值 */
const Hash = ({ value }: { value: string }) =>
  value ? (
    <Typography.Text copyable={{ text: value }} className={styles.mono}>
      {value.slice(0, 16)}…
    </Typography.Text>
  ) : (
    NONE
  );

/** 授权记录详情：只读，展示列表中放不下的授权来源字段（PRD §5.7） */
export default function DetailDrawer({ row: r, onClose }: Props) {
  const isPc = r?.terminal === 'PC';
  // 权限类授权没有协议正文，语言指授权时的界面语言
  const isAgreement = !!r && PC_TYPES.includes(r.consentType);

  return (
    <Drawer open={!!r} title="授权记录详情" width={560} onClose={onClose} destroyOnHidden>
      {r && (
        <>
          <div className={styles.section}>授权信息</div>
          <Descriptions
            bordered
            size="small"
            column={1}
            styles={{ label: { width: 140 } }}
            items={[
              { label: '客户ID', children: r.customerId },
              { label: '客户昵称', children: r.alias },
              { label: '手机号', children: r.phone },
              { label: 'APP/PC', children: r.terminal },
              { label: '同意类型', children: r.consentType },
              { label: '版本号', children: r.version },
              {
                label: isAgreement ? '协议语言' : '界面语言',
                children: r.lang ? langLabel(r.lang) : NONE,
              },
              { label: '授权场景', children: lookupText(SCENE, r.scene) || NONE },
              { label: '同意时间（客户端）', children: r.consentTime },
              { label: '服务端接收时间', children: r.serverTime || NONE },
            ]}
          />
          <div className={styles.section}>授权来源</div>
          {r.scene ? (
            <>
              <Descriptions
                bordered
                size="small"
                column={1}
                styles={{ label: { width: 140 } }}
                items={[
                  { label: '客户端版本', children: r.clientVersion },
                  { label: isPc ? '浏览器' : '设备型号', children: r.device },
                  { label: '操作系统', children: r.os },
                  { label: 'IP 地址', children: maskIp(r.ip) },
                  { label: 'IP 归属地', children: r.ipRegion },
                  { label: '设备ID（哈希）', children: <Hash value={r.deviceIdHash} /> },
                  { label: '协议正文哈希', children: <Hash value={r.contentHash} /> },
                ]}
              />
              <div className={styles.note}>IP 已脱敏，完整 IP 请通过导出获取。</div>
            </>
          ) : (
            <Alert
              type="info"
              showIcon={false}
              message={`该记录产生于来源信息采集上线（${SOURCE_SINCE}）之前，无授权场景及来源信息。`}
            />
          )}
        </>
      )}
    </Drawer>
  );
}
