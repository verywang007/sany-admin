import { useEffect, useState } from 'react';
import { App, Modal, Radio } from 'antd';
import { authUser, type AuthParams } from '@/services/customer/account';
import { errorText } from './types';

interface Props {
  /** 待提交的企业认证参数，为空时关闭 */
  params: AuthParams | null;
  onClose: () => void;
  onSuccess: () => void;
}

/** 企业认证前选择角色 */
export default function RoleSelectModal({ params, onClose, onSuccess }: Props) {
  const { message } = App.useApp();
  // 原系统没有默认选中项且跨次不重置；这里每次打开默认「非管理员」，与提交的默认值一致
  const [role, setRole] = useState<AuthParams['role']>('NORMAL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params) setRole('NORMAL');
  }, [params]);

  const submit = async () => {
    if (!params) return;
    setLoading(true);
    try {
      await authUser({ ...params, role });
      message.success('认证成功');
      onClose();
      onSuccess();
    } catch (e) {
      message.error(`认证失败:${errorText(e, '请联系管理员')}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="角色选择"
      open={!!params}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Radio.Group value={role} onChange={(e) => setRole(e.target.value)}>
        <Radio value="NORMAL">非管理员</Radio>
        <Radio value="ADMIN">管理员</Radio>
      </Radio.Group>
    </Modal>
  );
}
