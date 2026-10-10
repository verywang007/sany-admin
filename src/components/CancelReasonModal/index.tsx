import { useEffect, useState } from 'react';
import { Input, Modal, Typography } from 'antd';
import { colors } from '@/theme';

interface Props {
  open: boolean;
  /** 被取消的对象，用于提示文案，如「版本」「公告」 */
  subject: string;
  onCancel: () => void;
  onOk: (reason: string) => Promise<void>;
}

/** 取消发布：须填写不少于 5 个字的原因 */
export default function CancelReasonModal({ open, subject, onCancel, onOk }: Props) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setReason('');
      setError(false);
    }
  }, [open]);

  const submit = async () => {
    if (reason.trim().length < 5) {
      setError(true);
      return;
    }
    setLoading(true);
    try {
      await onOk(reason.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="取消发布"
      width={520}
      onCancel={onCancel}
      onOk={submit}
      confirmLoading={loading}
    >
      <Typography.Paragraph style={{ lineHeight: 1.8, marginBottom: 12 }}>
        取消后该{subject}将退回「草稿」状态，可重新编辑，操作会记入日志。请填写取消原因：
      </Typography.Paragraph>
      <Input.TextArea
        rows={4}
        value={reason}
        status={error ? 'error' : undefined}
        placeholder="请输入取消原因（必填，不少于 5 个字）"
        onChange={(e) => {
          setReason(e.target.value);
          if (error && e.target.value.trim().length >= 5) setError(false);
        }}
      />
      {error && (
        <div style={{ color: colors.danger, fontSize: 12, marginTop: 6 }}>请填写取消原因</div>
      )}
    </Modal>
  );
}
