import { useEffect, useState } from 'react';
import { App, Button, Modal, Radio, Space } from 'antd';
import { unbindCrm } from '@/services/customer/account';
import { errorText, type RowModalProps } from './types';

/** 取消认证：选择一个已绑定的客户编码解绑 */
export default function CancelAuthModal({ record, onClose, onSuccess }: RowModalProps) {
  const { message, modal } = App.useApp();
  const [selected, setSelected] = useState<string>();
  const binds = record?.crmBindList.filter((b) => b.crmCustomerNo) ?? [];

  useEffect(() => {
    if (record) setSelected(undefined);
  }, [record]);

  const confirm = () => {
    if (!record) return;
    // 原系统用 `a && a.length` 判断是否选中，绑定 id 为数字时永远判为未选；这里按是否有选中值判断
    if (!selected) {
      message.error('请选择需要取消认证的客户代码');
      return;
    }
    const recordId = record.id;
    onClose();
    modal.confirm({
      title: '您确定要解绑该用户吗？',
      onOk: async () => {
        try {
          await unbindCrm(recordId, selected);
          message.success('操作成功');
          onSuccess();
        } catch (e) {
          message.error(errorText(e));
        }
      },
    });
  };

  return (
    <Modal
      title="取消认证"
      open={!!record}
      onCancel={onClose}
      destroyOnHidden
      footer={
        binds.length ? (
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={confirm}>
              确认
            </Button>
          </Space>
        ) : (
          <Button onClick={onClose}>关闭</Button>
        )
      }
    >
      <Radio.Group
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{ width: '100%' }}
      >
        {binds.map((b) => (
          <div
            key={b.id}
            style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}
          >
            <Radio value={b.id}>{b.crmCustomerNo}</Radio>
          </div>
        ))}
      </Radio.Group>
    </Modal>
  );
}
