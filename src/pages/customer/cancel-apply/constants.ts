import type { CSSProperties } from 'react';
import { colors } from '@/theme';
import type { Option } from '@/components/SearchForm';
import { ACCOUNT_CANCEL_STATUS, type AccountCancelStatus } from '@/constants/accountCancel';
import type { CancelAction } from '@/services/customer/cancelApply';

/** 查询区「注销状态」可选值（不含 NORMAL），顺序同原型 */
const STATUS_ORDER: AccountCancelStatus[] = [
  'PENDING',
  'COOLING',
  'PROCESSING',
  'FAILED',
  'CANCELLED',
  'REJECTED',
  'REVOKED',
];

export const STATUS_OPTIONS: Option[] = STATUS_ORDER.map((s) => ({
  value: s,
  label: ACCOUNT_CANCEL_STATUS[s].text,
}));

export const COUNTRY_OPTIONS: Option[] = ['新加坡', '印度尼西亚', '马来西亚', '中国'].map((c) => ({
  value: c,
  label: c,
}));

/** 行操作按钮的显示条件（状态机，方案 §3） */
export const ACTIONS_BY_STATUS: Partial<Record<AccountCancelStatus, CancelAction[]>> = {
  PENDING: ['approve', 'reject'],
  FAILED: ['retry'],
  COOLING: ['revoke'],
};

export const ACTION_TEXT: Record<CancelAction, string> = {
  approve: '通过',
  reject: '驳回',
  retry: '重试',
  revoke: '强制撤销',
};

/** 操作确认弹窗文案 */
export const CONFIRM_TEXT: Record<CancelAction, { title: string; desc: string }> = {
  approve: {
    title: '确认审核通过？',
    desc: '通过后，该申请将进入 15 天冷静期。冷静期内用户可主动撤销，期满后系统将自动执行注销。',
  },
  reject: {
    title: '确认驳回该注销申请？',
    desc: '驳回后申请回到正常状态，用户可在 App 查看驳回结果。请填写驳回原因。',
  },
  retry: {
    title: '确认重试注销任务？',
    desc: '系统将只重试本申请中失败的子任务，不会重复处理已成功的步骤。',
  },
  revoke: {
    title: '确认强制撤销该申请？',
    desc: '强制撤销后该申请将终止，账号恢复为正常状态。该操作会写入审计日志。',
  },
};

export const EMPTY = '—';

/**
 * 把 theme colors 注入为 CSS 变量，供 index.module.css 使用（避免在 CSS 里写死色值）。
 * 弹窗渲染在 body 下，需在弹窗内容根节点上再挂一次。
 */
export const cssVars = {
  '--primary': colors.primary,
  '--border': colors.border,
  '--page-bg': colors.pageBg,
  '--text-secondary': colors.textSecondary,
} as CSSProperties;
