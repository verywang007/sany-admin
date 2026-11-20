import { assertNoActiveCancellation, recordDirectUserCancellation } from '@/services/customer/cancelApply';
import { useEffect, useState } from 'react';
import { App, Button, Checkbox, Form, Input, Modal, Select, Space, Typography } from 'antd';
import {
  cancelTenant,
  fetchCancelableTenants,
  sendCancelCode,
  verifyCancelCode,
  type CancelInput,
} from '@/services/customer/tenantCancel';

type Tenant = Awaited<ReturnType<typeof fetchCancelableTenants>>[number];
export default function CancelTenantModal({
  open,
  onClose,
  onSuccess,
  userMode = false,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userMode?: boolean;
}) {
  const [form] = Form.useForm<CancelInput>();
  const { message } = App.useApp();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const tenantId = Form.useWatch('tenantId', form);
  const tenant = tenants.find((t) => t.id === tenantId);
  useEffect(() => {
    if (open) {
      form.resetFields();
      setCode('');
      setVerified(false);
      setSent(false);
      void fetchCancelableTenants().then(setTenants);
    }
  }, [open, form]);
  async function run(action: () => Promise<void>) {
    setBusy(true);
    try {
      await action();
    } catch (error) {
      // 表单校验未通过时，字段下方已有提示，不再弹出「操作失败」
      if ((error as { errorFields?: unknown }).errorFields) return;
      void message.error(error instanceof Error ? error.message : '操作失败');
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={userMode ? '注销用户' : '注销租户'}
      open={open}
      width={720}
      onCancel={onClose}
      destroyOnClose
      footer={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button
            danger
            type="primary"
            disabled={!verified}
            loading={busy}
            onClick={() =>
              void run(async () => {
                const values = await form.validateFields();
                if (userMode && tenant) assertNoActiveCancellation(tenant.userId);
                const record = await cancelTenant(values, { userMode });
                if (userMode) recordDirectUserCancellation(record);
                void message.success(userMode ? '已提交注销申请，用户进入 15 天冷静期，已短信通知客户' : '租户已注销（模拟），记录已生成');
                onSuccess();
              })
            }
          >
            {userMode ? '确认注销用户' : '确认注销租户'}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="tenantId"
          label="用户ID、手机号"
          rules={[{ required: true, message: '请选择租户' }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            placeholder="搜索用户ID或手机号"
            options={tenants.map((t) => ({ value: t.id, label: `${t.userId} · ${userMode ? t.fullPhone : t.phone}` }))}
            onChange={() => {
              setVerified(false);
              setSent(false);
              setCode('');
            }}
          />
        </Form.Item>
        {tenant && (
          <Typography.Paragraph>
            姓名：{tenant.contact}
            <br />
            手机号码：{userMode ? tenant.fullPhone : tenant.phone}
            <br />
            邮箱：{tenant.email}
            <br />
            用户名：{tenant.username}
          </Typography.Paragraph>
        )}
        <Form.Item label="客户验证码（发送至客户已绑定手机）" required>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              value={code}
              maxLength={6}
              disabled={verified || busy}
              placeholder="请输入客户收到的6位验证码"
              onChange={(e) => setCode(e.target.value)}
            />
            <Button
              disabled={!tenant || busy || verified}
              onClick={() =>
                void run(async () => {
                  await sendCancelCode(tenantId);
                  setSent(true);
                  void message.success('模拟发送成功，演示验证码为123456');
                })
              }
            >
              {sent ? '重新发送' : '发送验证码'}
            </Button>
            <Button
              disabled={!sent || verified || busy || !/^\d{6}$/.test(code)}
              onClick={() =>
                void run(async () => {
                  await verifyCancelCode(tenantId, code);
                  setVerified(true);
                })
              }
            >
              {verified ? '已验证' : '验证'}
            </Button>
          </Space.Compact>
        </Form.Item>
        {userMode && (
          <Space style={{ display: 'flex' }} align="start">
            <Form.Item name="channel" label="申请渠道" rules={[{ required: true, message: '请选择申请渠道' }]} style={{ width: 200 }}>
              <Select placeholder="客户发起申请的渠道" options={['电话', '邮件', '在线客服'].map((v) => ({ value: v, label: v }))} />
            </Form.Item>
            <Form.Item name="ticketNo" label="客服工单号" style={{ width: 260 }}>
              <Input maxLength={50} placeholder="选填" />
            </Form.Item>
          </Space>
        )}
        <Form.Item name="reason" label="注销原因" rules={[{ required: true, whitespace: true }]}>
          <Input.TextArea rows={2} maxLength={500} showCount />
        </Form.Item>
        {userMode && (
          <Form.Item
            name="customerConfirmed"
            valuePropName="checked"
            rules={[{ validator: (_, v) => (v ? Promise.resolve() : Promise.reject(new Error('请确认客户已知晓注销影响并本人申请'))) }]}
          >
            <Checkbox>已向客户说明注销影响及 15 天冷静期，客户本人确认申请注销</Checkbox>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
