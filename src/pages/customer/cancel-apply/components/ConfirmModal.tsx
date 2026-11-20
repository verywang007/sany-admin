import { useEffect, useRef, useState } from 'react';
import { Input, Modal, Typography } from 'antd';
import type { TextAreaRef } from 'antd/es/input/TextArea';
import type { CancelAction } from '@/services/customer/cancelApply';
import { REVOKE_CONFIRM } from '../constants';

interface Props {
  /** 为空时关闭 */
  action?: CancelAction;
  onCancel: () => void;
  /** 返回 Promise 时确认按钮显示加载态 */
  onOk: (note: string) => Promise<void>;
}

/** 撤销注销确认：处理备注选填 */
export default function ConfirmModal({ action, onCancel, onOk }: Props) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextAreaRef>(null);

  // 每次打开都清空
  useEffect(() => {
    if (action) setNote('');
  }, [action]);

  const submit = async () => {
    setLoading(true);
    try {
      await onOk(note.trim());
    } finally {
      setLoading(false);
    }
  };

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
      <Typography.Title level={5} style={{ marginTop: 8 }}>
        {REVOKE_CONFIRM.title}
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ lineHeight: 1.8 }}>
        {REVOKE_CONFIRM.desc}
      </Typography.Paragraph>
      <Input.TextArea
        ref={inputRef}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ height: 76, resize: 'none' }}
        placeholder="请输入处理备注（选填）"
      />
    </Modal>
  );
}
