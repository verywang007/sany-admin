import { Button, Descriptions, Modal } from 'antd';
import type { TenantCreateRecord } from '@/services/customer/tenantCreate';

interface Props {
  record: TenantCreateRecord | null;
  onClose: () => void;
}

/** 租户详情（推断：原型快照未包含详情视图，只读展示列表字段） */
export default function TenantDetailModal({ record, onClose }: Props) {
  return (
    <Modal
      open={!!record}
      title="租户详情"
      width={720}
      onCancel={onClose}
      footer={<Button onClick={onClose}>关闭</Button>}
    >
      {record && (
        <Descriptions
          bordered
          size="small"
          column={2}
          labelStyle={{ width: 130 }}
          style={{ marginTop: 16 }}
        >
          <Descriptions.Item label="创建时间">{record.applyTime}</Descriptions.Item>
          <Descriptions.Item label="租户类型">{record.tenantTypeDesc}</Descriptions.Item>
          <Descriptions.Item label="租户ID">{record.companyId}</Descriptions.Item>
          <Descriptions.Item label="租户名称">{record.companyName}</Descriptions.Item>
          <Descriptions.Item label="管理员登录账号">{record.applyAccount}</Descriptions.Item>
          <Descriptions.Item label="企业注册号">{record.registrationNumber}</Descriptions.Item>
          <Descriptions.Item label="国家/地区">{record.countryDesc}</Descriptions.Item>
          <Descriptions.Item label="操作人">{record.approvalUserName}</Descriptions.Item>
          <Descriptions.Item label="备注说明" span={2}>
            {record.applicationDescription}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
