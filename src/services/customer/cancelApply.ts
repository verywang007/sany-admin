import dayjs from 'dayjs';
import { delay, exact, fuzzy, inRange, paginate } from '@/mock/utils';
import { cancelApplySeed } from '@/mock/customer/cancelApply';
import { COOLING_DAYS, type AccountCancelStatus } from '@/constants/accountCancel';
import type { ListFetcher } from '@/types/common';

/** 注销申请 */
export interface CancelApply {
  id: string;
  /** 申请单号 */
  no: string;
  /** 昵称 */
  user: string;
  userId: string;
  /** 登录用户名 */
  login: string;
  phone: string;
  /** 用户类型（展示文案，如「个体户/企业租户」） */
  userType: string;
  /** 当前处理人 */
  handler: string;
  country: string;
  /** 申请来源：APP 自助 / MANUAL 后管代客 */
  source: 'APP' | 'MANUAL';
  reason: string;
  /** 校验结果摘要，如「软提醒 4 条」「校验通过」 */
  risk: string;
  status: AccountCancelStatus;
  /** 申请时间 YYYY-MM-DD HH:mm */
  apply: string;
  /** 冷静期截止 YYYY-MM-DD，空表示无 */
  cool: string;
  /** 完成时间，空表示未完成 */
  finish: string;
  /** 最近一次审核/处理意见 */
  auditOpinion?: string;
}

export interface CancelApplyQuery {
  no?: string;
  login?: string;
  phone?: string;
  status?: AccountCancelStatus;
  country?: string;
  applyTime?: unknown;
  finishTime?: unknown;
  handler?: string;
  [key: string]: unknown;
}

export type CancelAction = 'approve' | 'reject' | 'retry' | 'revoke';

// 原型共 7 条，总数以实际数据为准（原型 HTML 静态写的 49 条不采用）
const rows: CancelApply[] = cancelApplySeed.map((r) => ({ ...r }));

export const fetchCancelApplyList: ListFetcher<CancelApply, CancelApplyQuery> = async (q) => {
  await delay();
  const list = rows.filter(
    (r) =>
      fuzzy(r.no, q.no) &&
      fuzzy(r.login, q.login) &&
      fuzzy(r.phone, q.phone) &&
      exact(r.status, q.status) &&
      exact(r.country, q.country) &&
      inRange(r.apply, q.applyTime) &&
      inRange(r.finish, q.finishTime) &&
      fuzzy(r.handler, q.handler),
  );
  return paginate(list, q);
};

export interface CancelApplyStats {
  pending: number;
  cooling: number;
  failed: number;
  /** 本月已完成（已注销且完成时间在本月） */
  cancelledThisMonth: number;
}

/** 列表顶部统计卡（方案 §7.2），统计全部申请，不受查询条件影响 */
export async function fetchCancelApplyStats(): Promise<CancelApplyStats> {
  await delay(100);
  const count = (s: AccountCancelStatus) => rows.filter((r) => r.status === s).length;
  return {
    pending: count('PENDING'),
    cooling: count('COOLING'),
    failed: count('FAILED'),
    cancelledThisMonth: rows.filter(
      (r) => r.status === 'CANCELLED' && r.finish && dayjs(r.finish).isSame(dayjs(), 'month'),
    ).length,
  };
}

/** 各操作允许的起始状态与目标状态（方案 §3 状态机） */
const TRANSITIONS: Record<CancelAction, { from: AccountCancelStatus; to: AccountCancelStatus }> = {
  approve: { from: 'PENDING', to: 'COOLING' },
  reject: { from: 'PENDING', to: 'REJECTED' },
  retry: { from: 'FAILED', to: 'PROCESSING' },
  revoke: { from: 'COOLING', to: 'REVOKED' },
};

/** 执行审核/驳回/重试/强制撤销；note 为处理备注（驳回时必填，由页面校验） */
export async function handleCancelApply(id: string, action: CancelAction, note: string) {
  await delay();
  const row = rows.find((r) => r.id === id);
  const t = TRANSITIONS[action];
  if (!row || row.status !== t.from) throw new Error('申请状态已变化，请刷新后重试');
  row.status = t.to;
  if (action === 'approve') {
    // 原型缺陷：非 App 联动行审核通过后冷静期截止不更新；这里按规则设为当前 + 15 天
    row.cool = dayjs().add(COOLING_DAYS, 'day').format('YYYY-MM-DD');
    row.auditOpinion = note || '审核通过';
  } else if (action === 'reject') {
    row.auditOpinion = note;
  } else if (note) {
    row.auditOpinion = note;
  }
}
