import { CURRENT_USER } from '@/config/app';
import type { CancelRecord } from './tenantCancel';
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
  email: string;
  /** 用户类型（展示文案，如「个体户/企业租户」） */
  userType: string;
  operator: string;
  country: string;
  /** 申请来源：APP 自助 / MANUAL 后管代客 */
  source: 'APP' | 'MANUAL';
  reason: string;
  status: AccountCancelStatus;
  /** 申请时间 YYYY-MM-DD HH:mm */
  apply: string;
  /** 冷静期截止 YYYY-MM-DD，空表示无 */
  cool: string;
  /** 完成时间，空表示未完成 */
  finish: string;
  /** 最近一次处理备注（撤销注销时填写） */
  remark?: string;
  /** 后管代客：客户发起申请的渠道（电话 / 邮件 / 在线客服） */
  channel?: string;
  /** 后管代客：客服工单号 */
  ticketNo?: string;
  /** 后管代客：客户短信验证码验证通过时间 */
  verifiedAt?: string;
}

export interface CancelApplyQuery {
  no?: string;
  login?: string;
  phone?: string;
  status?: AccountCancelStatus;
  source?: 'APP' | 'MANUAL';
  country?: string;
  applyTime?: unknown;
  finishTime?: unknown;
  operator?: string;
  [key: string]: unknown;
}

/** 后管可执行的操作：仅撤销后管代客发起、处于冷静期的申请 */
export type CancelAction = 'revoke';

// 原型共 7 条，总数以实际数据为准（原型 HTML 静态写的 49 条不采用）
const rows: CancelApply[] = cancelApplySeed.map((r) => ({ ...r }));

export const fetchCancelApplyList: ListFetcher<CancelApply, CancelApplyQuery> = async (q) => {
  await delay();
  const list = rows.filter(
    (r) =>
      fuzzy(r.no, q.no) &&
      (fuzzy(r.user, q.login) || fuzzy(r.login, q.login)) &&
      fuzzy(r.phone, q.phone) &&
      exact(r.status, q.status) &&
      exact(r.source, q.source) &&
      exact(r.country, q.country) &&
      inRange(r.apply, q.applyTime) &&
      inRange(r.finish, q.finishTime) &&
      fuzzy(r.operator, q.operator),
  );
  return paginate(list, q);
};

/** 撤销注销（仅后管代客 + 冷静期）；note 为处理备注，选填 */
export async function handleCancelApply(id: string, _action: CancelAction, note: string) {
  await delay();
  const row = rows.find((r) => r.id === id);
  if (!row || row.status !== 'COOLING') throw new Error('申请状态已变化，请刷新后重试');
  if (row.source !== 'MANUAL') throw new Error('仅允许撤销后管发起的注销');
  row.status = 'REVOKED';
  row.operator = CURRENT_USER.name;
  if (note) row.remark = note;
}

/** 同一用户同一时间只能有一笔冷静期中的申请 */
export function assertNoActiveCancellation(userId: string) {
  if (rows.some((r) => r.userId === userId && r.status === 'COOLING'))
    throw new Error('该用户已有冷静期中的注销申请，不能重复发起');
}

/** 后管代客注销：生成冷静期申请（无平台审核），冷静期内管理员或客户本人可撤销。 */
export function recordDirectUserCancellation(record: CancelRecord) {
  assertNoActiveCancellation(record.userId);
  const prefix = `ZX-${dayjs().format('YYYYMMDD')}-`;
  const sequence = Math.max(0, ...rows.filter(r => r.no.startsWith(prefix)).map(r => Number(r.no.slice(-2)))) + 1;
  if (sequence > 99) throw new Error('当日申请编号已用完');
  rows.unshift({
    id: `direct-${record.id}`, no: prefix + String(sequence).padStart(2, '0'), user: record.nickname || record.contact,
    userId: record.userId, login: record.username, phone: record.phone, email: record.email,
    userType: '', operator: record.operator, country: '', source: 'MANUAL',
    reason: record.reason, status: 'COOLING',
    channel: record.channel, ticketNo: record.ticketNo, verifiedAt: record.verifiedAt,
    apply: dayjs(record.createdAt).format('YYYY-MM-DD HH:mm'),
    cool: dayjs(record.createdAt).add(COOLING_DAYS, 'day').format('YYYY-MM-DD'), finish: '',
  });
}
