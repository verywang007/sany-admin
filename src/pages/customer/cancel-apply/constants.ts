import type { CSSProperties } from 'react';
import { colors } from '@/theme';
import type { Option } from '@/components/SearchForm';
import { ACCOUNT_CANCEL_STATUS, type AccountCancelStatus } from '@/constants/accountCancel';

/** 查询区「注销状态」可选值，顺序同原型 */
const STATUS_ORDER: AccountCancelStatus[] = ['COOLING', 'REVOKED', 'CANCELLED'];

export const STATUS_OPTIONS: Option[] = STATUS_ORDER.map((s) => ({
  value: s,
  label: ACCOUNT_CANCEL_STATUS[s].text,
}));

export const COUNTRY_OPTIONS: Option[] = ['新加坡', '印度尼西亚', '马来西亚', '中国'].map((c) => ({
  value: c,
  label: c,
}));

/** 撤销注销确认弹窗文案 */
export const REVOKE_CONFIRM = {
  title: '确认撤销注销？',
  desc: '撤销后该申请将终止，账号恢复为正常状态。该操作会写入审计日志。',
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
