import type { Lookup } from '@/components/StatusTag';

/**
 * 账户注销状态，值集编码 MYSANY.ACCOUNT_CANCEL_STATUS。
 * 无平台审核、无硬拦截：提交即进入冷静期，期满注销；冷静期内可撤销（见 APP 项目 docs/账号注销PRD.md）。
 */
export const ACCOUNT_CANCEL_STATUS = {
  COOLING: { text: '冷静期', color: 'blue' },
  REVOKED: { text: '已撤销' },
  CANCELLED: { text: '已注销' },
} satisfies Lookup;

export type AccountCancelStatus = keyof typeof ACCOUNT_CANCEL_STATUS;

/** 冷静期时长（天），方案 §3.1 默认 15 天 */
export const COOLING_DAYS = 15;

/** 注销申请来源 */
export const ACCOUNT_CANCEL_SOURCE: Lookup = {
  APP: { text: 'App自助' },
  MANUAL: { text: '后管代客' },
};
