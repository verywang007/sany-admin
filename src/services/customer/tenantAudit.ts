import { delay, expand, fuzzy, inRange, paginate } from '@/mock/utils';
import { tenantApplySeed } from '@/mock/customer/tenantAudit';
import type { ListFetcher } from '@/types/common';

/** 企业客户申请记录 */
export interface TenantApply {
  id: string;
  applyNo: string;
  applyTime: string;
  applyAccount: string;
  applyName: string;
  /** D365 客户编码 */
  customerCode: string;
  companyName: string;
  registrationNumber: string;
  contactName: string;
  contactPhone: string;
  /** 转换完成时间，为空表示尚未转换 */
  approvalTime: string;
}

export interface TenantApplyQuery {
  time?: unknown;
  applyAccount?: string;
  applyName?: string;
  companyName?: string;
  [key: string]: unknown;
}

// 原型共 45 条：样本 20 条，其余复制补齐
const rows = expand(tenantApplySeed, 45, (r, n, i) => ({
  ...r,
  id: String(i + 1),
  applyNo: `${r.applyNo}-${n}`,
}));

export const fetchTenantApplyList: ListFetcher<TenantApply, TenantApplyQuery> = async (q) => {
  await delay();
  const list = rows.filter(
    (r) =>
      inRange(r.applyTime, q.time) &&
      fuzzy(r.applyAccount, q.applyAccount) &&
      fuzzy(r.applyName, q.applyName) &&
      fuzzy(r.companyName, q.companyName),
  );
  return paginate(list, q);
};
