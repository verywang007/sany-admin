import { useEffect, useState } from 'react';
import { App, Form, Input, Modal } from 'antd';
import { updateEmail } from '@/services/customer/account';
import { errorText, type RowModalProps } from './types';

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/** 修改邮箱（点击邮箱单元格） */
export default function EmailModal({ record, onClose, onSuccess }: RowModalProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<{ email: string }>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) form.setFieldsValue({ email: record.email });
  }, [record, form]);

  const submit = async () => {
    if (!record) return;
    const { email } = await form.validateFields();
    setLoading(true);
    try {
      await updateEmail(record.userId, email.trim());
      message.success('操作成功');
      onClose();
      onSuccess();
    } catch (e) {
      message.error(errorText(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="修改邮箱"
      width={500}
      open={!!record}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form form={form} labelCol={{ flex: '80px' }} preserve={false}>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, whitespace: true, message: '邮箱不可为空' },
            { pattern: EMAIL_RE, message: '请输入正确的邮箱格式' },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
