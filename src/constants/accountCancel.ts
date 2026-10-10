import type { Lookup } from '@/components/StatusTag';

/**
 * 账户注销状态，值集编码 MYSANY.ACCOUNT_CANCEL_STATUS（见 docs/客户管理-账户注销-方案.md §3.1）。
 * 标签色以方案为准：原型把「已驳回」画成灰色，方案要求红色，这里按方案。
 */
export const ACCOUNT_CANCEL_STATUS = {
  NORMAL: { text: '正常' },
  PENDING: { text: '待审核', color: 'orange' },
  REJECTED: { text: '已驳回', color: 'red' },
  COOLING: { text: '冷静期', color: 'blue' },
  PROCESSING: { text: '注销中', color: 'purple' },
  CANCELLED: { text: '已注销' },
  FAILED: { text: '注销失败', color: 'red' },
  REVOKED: { text: '已撤销' },
} satisfies Lookup;

export type AccountCancelStatus = keyof typeof ACCOUNT_CANCEL_STATUS;

/** 冷静期时长（天），方案 §3.1 默认 15 天 */
export const COOLING_DAYS = 15;

/** 注销申请来源 */
export const ACCOUNT_CANCEL_SOURCE: Lookup = {
  APP: { text: 'App自助' },
  MANUAL: { text: '后管代客' },
};
