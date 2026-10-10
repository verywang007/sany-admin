import { useState } from 'react';
import { App, Form, Input, Modal } from 'antd';
import { createOrganization, type OrganizationForm } from '@/services/customer/organization';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

/** 创建组织（原型未捕获该弹窗，按规格推断：组织名称 + 组织关联客户编码） */
export default function CreateModal({ open, onClose, onCreated }: Props) {
  const { message } = App.useApp();
  const [form] = Form.useForm<OrganizationForm>();
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      await createOrganization(values);
      message.success('创建成功');
      onClose();
      onCreated();
    } catch (e) {
      message.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="创建组织"
      width={520}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form
        form={form}
        labelCol={{ flex: '130px' }}
        wrapperCol={{ flex: '1 1 0' }}
        preserve={false}
      >
        <Form.Item
          name="organizationName"
          label="组织名称"
          rules={[{ required: true, whitespace: true, message: '请输入组织名称' }]}
        >
          <Input maxLength={100} placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="crmCustomerNo"
          label="组织关联客户编码"
          rules={[{ required: true, whitespace: true, message: '请输入组织关联客户编码' }]}
        >
          <Input maxLength={20} placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
