import { useEffect, useState } from 'react';
import { App, Col, Form, Input, Modal, Row, Select } from 'antd';
import {
  fetchTelCodeOptions,
  saveDeviceAdmin,
  type DeviceAdmin,
  type DeviceAdminForm,
} from '@/services/customer/deviceAdmin';

interface Props {
  open: boolean;
  /** 有值为编辑，否则为新增 */
  record: DeviceAdmin | null;
  onCancel: () => void;
  onSuccess: () => void;
}

type Option = { label: string; value: string };

/** 新增 / 编辑设备管理员（同一个弹窗，标题按是否有 id 区分） */
export default function DeviceAdminModal({ open, record, onCancel, onSuccess }: Props) {
  const { message } = App.useApp();
  const [form] = Form.useForm<DeviceAdminForm>();
  const [saving, setSaving] = useState(false);
  const [telOptions, setTelOptions] = useState<Option[]>([]);

  useEffect(() => {
    fetchTelCodeOptions().then(setTelOptions);
  }, []);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (record) form.setFieldsValue(record);
  }, [open, record, form]);

  const submit = async () => {
    // 防重复提交
    if (saving) return;
    const values = await form.validateFields();
    setSaving(true);
    try {
      await saveDeviceAdmin({
        ...values,
        id: record?.id,
        internationalTelCode: values.internationalTelCode || null,
        adminPhone: values.adminPhone ?? '',
      });
      message.success('操作成功');
      onSuccess();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={record ? '编辑' : '新增'}
      width={600}
      closable={false}
      okText="确定"
      cancelText="取消"
      confirmLoading={saving}
      onOk={submit}
      onCancel={onCancel}
      destroyOnHidden
    >
      <Form
        form={form}
        labelCol={{ flex: '130px' }}
        wrapperCol={{ flex: 1 }}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="crmCustomerName"
          label="客户名称"
          rules={[{ required: true, message: '请输入客户名称' }]}
        >
          <Input maxLength={100} placeholder="请输入客户名称" />
        </Form.Item>
        <Form.Item
          name="crmCustomerNo"
          label="客户编码"
          rules={[{ required: true, message: '请输入客户编码' }]}
        >
          <Input maxLength={100} placeholder="请输入客户编码" />
        </Form.Item>
        <Form.Item
          name="adminName"
          label="管理员名称"
          rules={[{ required: true, message: '请输入管理员名称' }]}
        >
          <Input maxLength={100} placeholder="请输入管理员名称" />
        </Form.Item>
        {/* 区号与号码互为条件必填：要么都填，要么都不填 */}
        <Form.Item label="管理员手机号" style={{ marginBottom: 0 }}>
          <Row>
            <Col span={8}>
              <Form.Item
                name="internationalTelCode"
                dependencies={['adminPhone']}
                rules={[
                  ({ getFieldValue }) => ({
                    required: !!getFieldValue('adminPhone'),
                    message: '请选择区号',
                  }),
                ]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder="请选择"
                  options={telOptions}
                  // 按选项文案不区分大小写包含匹配
                  filterOption={(input, opt) =>
                    String(opt?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
            <Col span={15} offset={1}>
              <Form.Item
                name="adminPhone"
                dependencies={['internationalTelCode']}
                // 原型用 NumberField，会丢掉号码前导 0（如 08114487857）；这里改为只允许数字的文本框
                normalize={(v: string) => (v ?? '').replace(/\D/g, '')}
                rules={[
                  ({ getFieldValue }) => ({
                    required: !!getFieldValue('internationalTelCode'),
                    message: '请输入管理员手机号',
                  }),
                ]}
              >
                <Input maxLength={100} placeholder="请输入管理员手机号" />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          name="adminMysanyNo"
          label="管理员MySany账号"
          rules={[{ required: true, message: '请输入管理员MySany账号' }]}
        >
          {/* 账号格式不一（邮箱、手机号、自定义），不做格式校验 */}
          <Input maxLength={100} placeholder="请输入管理员MySany账号" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
