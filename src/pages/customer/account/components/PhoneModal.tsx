import { useEffect, useState } from 'react';
import { App, Form, Input, Modal, Select } from 'antd';
import { fetchCallPrefixes, updatePhone } from '@/services/customer/account';
import { errorText, type RowModalProps } from './types';

interface Values {
  internationalCallPrefix?: string;
  phone: string;
}

/** 修改联系电话（点击联系电话单元格） */
export default function PhoneModal({ record, onClose, onSuccess }: RowModalProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<Values>();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (!record) return;
    form.setFieldsValue({
      internationalCallPrefix: record.internationalCallPrefix || undefined,
      phone: record.contactPhone,
    });
    fetchCallPrefixes().then((list) => {
      // 选项值是区号，多个国家共用区号（如 +7）时合并为一项，避免重复值
      const byPrefix = new Map<string, string[]>();
      list.forEach((c) =>
        byPrefix.set(c.internationalCallPrefix, [
          ...(byPrefix.get(c.internationalCallPrefix) ?? []),
          c.cityName,
        ]),
      );
      setOptions(
        [...byPrefix].map(([value, names]) => ({ value, label: `${names.join('/')}(${value})` })),
      );
    });
  }, [record, form]);

  const submit = async () => {
    if (!record) return;
    const v = await form.validateFields();
    setLoading(true);
    try {
      await updatePhone(record.userId, v.phone.trim(), v.internationalCallPrefix);
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
      title="修改联系电话"
      width={500}
      open={!!record}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form form={form} labelCol={{ flex: '80px' }} preserve={false}>
        <Form.Item name="internationalCallPrefix" label="区号">
          <Select
            showSearch
            allowClear
            placeholder="请选择区号"
            options={options}
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item
          name="phone"
          label="联系电话"
          rules={[{ required: true, whitespace: true, message: '联系电话不可为空' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
