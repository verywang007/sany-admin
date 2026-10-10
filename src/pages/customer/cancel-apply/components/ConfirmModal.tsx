import { useEffect, useRef, useState } from 'react';
import { App, Checkbox, Input, Modal, Typography } from 'antd';
import type { TextAreaRef } from 'antd/es/input/TextArea';
import type { CancelAction } from '@/services/customer/cancelApply';
import { CONFIRM_TEXT } from '../constants';

interface Props {
  /** 为空时关闭 */
  action?: CancelAction;
  onCancel: () => void;
  /** 返回 Promise 时确认按钮显示加载态 */
  onOk: (note: string) => Promise<void>;
}

const APPROVE_CHECKS = ['已确认用户身份真实性', '已确认校验结果'];

/** 操作确认：驳回原因必填，其他操作备注选填 */
export default function ConfirmModal({ action, onCancel, onOk }: Props) {
  const { message } = App.useApp();
  const [note, setNote] = useState('');
  const [checked, setChecked] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextAreaRef>(null);
  const isReject = action === 'reject';

  // 每次打开都清空
  useEffect(() => {
    if (action) {
      setNote('');
      setChecked([]);
    }
  }, [action]);

  const submit = async () => {
    const value = note.trim();
    if (isReject && !value) {
      message.warning('驳回原因不能为空');
      inputRef.current?.focus();
      return;
    }
    // 方案 §7.4 的增强（原型未实现）：审核通过须勾选两项确认
    if (action === 'approve' && checked.length < APPROVE_CHECKS.length) {
      message.warning('请先勾选确认项');
      return;
    }
    setLoading(true);
    try {
      await onOk(value);
    } finally {
      setLoading(false);
    }
  };

  const text = action ? CONFIRM_TEXT[action] : undefined;

  return (
    <Modal
      open={!!action}
      title="操作确认"
      width={440}
      okText="确认"
      cancelText="取消"
      confirmLoading={loading}
      onOk={submit}
      onCancel={onCancel}
      afterOpenChange={(open) => open && inputRef.current?.focus()}
      destroyOnHidden
    >
      {text && (
        <>
          <Typography.Title level={5} style={{ marginTop: 8 }}>
            {text.title}
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ lineHeight: 1.8 }}>
            {text.desc}
          </Typography.Paragraph>
          {action === 'approve' && (
            <Checkbox.Group
              style={{ marginBottom: 12 }}
              options={APPROVE_CHECKS}
              value={checked}
              onChange={(v) => setChecked(v as string[])}
            />
          )}
          <Input.TextArea
            ref={inputRef}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ height: 76, resize: 'none' }}
            placeholder={isReject ? '请输入驳回原因（必填）' : '请输入处理备注（选填）'}
          />
        </>
      )}
    </Modal>
  );
}
