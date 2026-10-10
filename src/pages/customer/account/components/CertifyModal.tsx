import { useEffect, useState } from 'react';
import { App, Form, Input, Modal } from 'antd';
import { authUser, queryCrmInfo, type AuthParams } from '@/services/customer/account';
import { errorText, type RowModalProps } from './types';

/** 认证类型：UN_AUTH 0 / PERSIONAL_AUTH 1 / ENTERPRISE_AUTH 2 / AGENT_AUTH 3 */
export const ENTERPRISE_AUTH = 2;

interface Props extends RowModalProps {
  /** 企业客户：进入「角色选择」 */
  onEnterprise: (params: AuthParams) => void;
}

/** 认证用户第一步「编辑」：输入客户编码/合同编码，查 CRM 后按客户类别认证 */
export default function CertifyModal({ record, onClose, onSuccess, onEnterprise }: Props) {
  const { message } = App.useApp();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) setCode('');
  }, [record]);

  const submit = async () => {
    if (!record) return;
    // 原系统：未填写时直接关闭，不提示
    if (!code.trim()) {
      onClose();
      return;
    }
    setLoading(true);
    try {
      let params: AuthParams;
      try {
        const info = await queryCrmInfo(code, record.countryCode);
        params = {
          role: 'NORMAL',
          authType: info.crmCustomerCategory,
          crmCustomerNo: info.crmCustomerNo,
          infoId: record.id,
        };
      } catch (e) {
        message.error(`获取用户编码失败:${errorText(e, '')}`);
        return;
      }
      onClose();
      if (params.authType === ENTERPRISE_AUTH) {
        onEnterprise(params);
        return;
      }
      try {
        await authUser(params);
        message.success('认证成功');
        onSuccess();
      } catch (e) {
        message.error(`认证失败:${errorText(e, '请联系管理员')}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="编辑"
      width={500}
      open={!!record}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form labelCol={{ flex: '130px' }}>
        <Form.Item label="客户编码/合同编码：" colon={false}>
          <Input value={code} onChange={(e) => setCode(e.target.value)} onPressEnter={submit} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
