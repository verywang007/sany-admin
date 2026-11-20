import dayjs from 'dayjs';
import { CURRENT_USER } from '@/config/app';
import { tenantCancelOptions, tenantCancelSeed } from '@/mock/customer/tenantCancel';
import { delay, fuzzy, inRange, paginate } from '@/mock/utils';
import type { ListFetcher } from '@/types/common';

export interface CancelInput {
  tenantId: string;
  authority?: string;
  reason: string;
  instruction?: string;
  retention?: string;
  retentionBasis?: string;
  retentionUntil?: string;
  acknowledged?: boolean;
  /** 注销用户（代客）：客户发起申请的渠道 */
  channel?: string;
  /** 注销用户（代客）：客服工单号 */
  ticketNo?: string;
  /** 注销用户（代客）：已向客户说明影响，客户本人确认申请 */
  customerConfirmed?: boolean;
}
export interface CancelRecord extends CancelInput {
  id: string;
  tenantName: string;
  userId: string;
  nickname: string;
  contact: string;
  phone: string;
  email: string;
  username: string;
  createdAt: string;
  verifiedAt: string;
  operator: string;
  status: string;
}
let rows: CancelRecord[] = [...tenantCancelSeed];
const challenges = new Map<
  string,
  { expires: number; sent: number; attempts: number; verifiedAt?: string }
>();
export async function fetchCancelableTenants() {
  await delay();
  return tenantCancelOptions.filter((t) => !rows.some((r) => r.tenantId === t.id));
}
export const fetchTenantCancelList: ListFetcher<CancelRecord> = async (q) => {
  await delay();
  return paginate(
    rows.filter(
      (r) =>
        fuzzy(r.tenantId, q.tenantId) &&
        fuzzy(r.userId, q.userId) &&
        (fuzzy(r.nickname, q.identity) || fuzzy(r.username, q.identity)) &&
        fuzzy(r.tenantName, q.tenantName) &&
        fuzzy(r.contact, q.contact) &&
        fuzzy(r.phone, q.phone) &&
        fuzzy(r.email, q.email) &&
        fuzzy(r.username, q.username) &&
        fuzzy(r.operator, q.operator) &&
        inRange(r.createdAt, q.times),
    ),
    q,
  );
};
export async function sendCancelCode(tenantId: string) {
  await delay();
  if (!(await fetchCancelableTenants()).some((t) => t.id === tenantId))
    throw new Error('租户不存在或已注销');
  const previous = challenges.get(tenantId);
  if (previous && Date.now() - previous.sent < 60000) throw new Error('请在发送满60秒后重试');
  challenges.set(tenantId, { expires: Date.now() + 300000, sent: Date.now(), attempts: 0 });
}
export async function verifyCancelCode(tenantId: string, code: string) {
  await delay();
  const challenge = challenges.get(tenantId);
  if (!challenge || challenge.expires < Date.now())
    throw new Error('验证码未发送或已过期，请重新发送');
  if (challenge.attempts >= 5) throw new Error('尝试次数过多，请重新发送验证码');
  challenge.attempts++;
  // 原型专用验证码；正式环境必须由服务端校验短信凭证，禁止沿用此逻辑。
  if (code !== '123456') throw new Error('验证码错误');
  challenge.verifiedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
}
/** userMode：后管代客注销用户，只校验验证码并返回记录，不计入「注销租户」列表（用户进入冷静期，可被撤销） */
export async function cancelTenant(input: CancelInput, { userMode = false }: { userMode?: boolean } = {}) {
  await delay();
  const challenge = challenges.get(input.tenantId);
  if (!challenge?.verifiedAt || challenge.expires < Date.now())
    throw new Error('请先完成客户验证码验证');
  // 表单已精简为用户选择、短信验证和注销原因，不再校验已移除的授权及数据处置字段。
  if (!input.reason?.trim()) throw new Error('请填写注销原因');
  const tenant = (await fetchCancelableTenants()).find((t) => t.id === input.tenantId);
  if (!tenant) throw new Error('租户不存在或已注销');
  const record: CancelRecord = {
      ...input,
      id: `TC${Date.now()}`,
      tenantName: tenant.name,
      userId: tenant.userId,
      nickname: tenant.nickname,
      contact: tenant.contact,
      phone: tenant.phone,
      email: tenant.email,
      username: tenant.username,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      verifiedAt: challenge.verifiedAt,
      operator: CURRENT_USER.name,
      status: userMode ? '冷静期' : '已注销',
  };
  if (!userMode) rows = [record, ...rows];
  challenges.delete(input.tenantId);
  return record;
}
