import { useEffect, useState } from 'react';
import { App, Form, Input, Modal } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { resetPassword } from '@/services/customer/account';
import { type RowModalProps } from './types';

const PWD_RE = /^(?!^\d+$)(?!^[A-Za-z]+$)(?!^[~!@#$%^&*_.]+$).{8,16}$/;
const PWD_HELP = '密码8到16位，并至少包含下面两种：字母（不区分大小写）、数字、特殊字符~!@#$%^&*_.';

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = LOWER.toUpperCase();
const DIGIT = '0123456789';
const pick = (s: string) => s[Math.floor(Math.random() * s.length)];

/** 随机密码（原系统 medium 级别）：8 位，至少各含 1 个小写、大写、数字 */
function randomPassword(length = 8) {
  const chars = [pick(LOWER), pick(UPPER), pick(DIGIT)];
  while (chars.length < length) chars.push(pick(LOWER + UPPER + DIGIT));
  return chars.sort(() => Math.random() - 0.5).join('');
}

/** 重置密码（打开前已在页面里二次确认「确定重置密码吗？」） */
export default function ResetPasswordModal({ record, onClose, onSuccess }: RowModalProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<{ loginName: string; newPwd: string }>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) form.setFieldsValue({ loginName: record.loginName, newPwd: randomPassword() });
  }, [record, form]);

  const submit = async () => {
    if (!record) return;
    const { newPwd } = await form.validateFields();
    setLoading(true);
    try {
      await resetPassword(record.userId, newPwd);
      message.success('操作成功');
      onClose();
      onSuccess();
    } catch {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="重置密码"
      width={500}
      open={!!record}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form form={form} labelCol={{ flex: '80px' }} preserve={false}>
        <Form.Item name="loginName" label="登录名">
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name="newPwd"
          label="新密码"
          extra={PWD_HELP}
          rules={[
            { required: true, message: '请输入新密码' },
            { pattern: PWD_RE, message: PWD_HELP },
          ]}
        >
          <Input
            suffix={
              <ReloadOutlined
                style={{ cursor: 'pointer' }}
                onClick={() => form.setFieldValue('newPwd', randomPassword())}
              />
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
