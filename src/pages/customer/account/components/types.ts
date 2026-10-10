import type { Account } from '@/services/customer/account';

/** 行级弹窗的通用属性：record 为空时关闭 */
export interface RowModalProps {
  record: Account | null;
  onClose: () => void;
  /** 操作成功后回调（按当前页重查） */
  onSuccess: () => void;
}

export const errorText = (e: unknown, fallback = '操作失败') =>
  (e instanceof Error && e.message) || fallback;
