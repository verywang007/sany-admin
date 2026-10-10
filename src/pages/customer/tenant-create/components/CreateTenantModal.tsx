import { useState } from 'react';
import { App, Form, Input, Modal, Select } from 'antd';
import { createTenant, type TenantCreateForm } from '@/services/customer/tenantCreate';
import { COUNTRY_OPTIONS, TENANT_TYPE_OPTIONS } from '../constants';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

/** 创建租户弹窗（推断：原型快照未包含该视图，字段取自列表列） */
export default function CreateTenantModal({ open, onCancel, onSuccess }: Props) {
  const { message } = App.useApp();
  const [form] = Form.useForm<TenantCreateForm>();
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      await createTenant(values);
      message.success('创建成功');
      form.resetFields();
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="创建租户"
      width={560}
      okText="确定"
      cancelText="取消"
      confirmLoading={loading}
      onOk={submit}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      destroyOnHidden
    >
      <Form
        form={form}
        labelCol={{ flex: '120px' }}
        wrapperCol={{ flex: 1 }}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="tenantType"
          label="租户类型"
          rules={[{ required: true, message: '请选择租户类型' }]}
        >
          <Select placeholder="请选择" options={TENANT_TYPE_OPTIONS} />
        </Form.Item>
        <Form.Item
          name="companyName"
          label="租户名称"
          rules={[{ required: true, whitespace: true, message: '请输入租户名称' }]}
        >
          <Input placeholder="请输入" maxLength={100} />
        </Form.Item>
        <Form.Item
          name="applyAccount"
          label="管理员登录账号"
          rules={[{ required: true, whitespace: true, message: '请输入管理员登录账号' }]}
        >
          <Input placeholder="请输入手机号 / 邮箱 / 用户名" maxLength={100} />
        </Form.Item>
        <Form.Item name="registrationNumber" label="企业注册号">
          <Input placeholder="请输入" maxLength={100} />
        </Form.Item>
        <Form.Item name="countryDesc" label="国家/地区">
          <Select placeholder="请选择" options={COUNTRY_OPTIONS} allowClear showSearch />
        </Form.Item>
        <Form.Item name="applicationDescription" label="备注说明">
          <Input.TextArea placeholder="请输入" rows={3} maxLength={500} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
