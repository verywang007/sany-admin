import { delay, paginate } from '@/mock/utils';
import { retentionSeed } from '@/mock/customer-analysis/retention';
import type { ListFetcher } from '@/types/common';
import { activePercent, filterUserMetric, type MauUser, type UserMetricQuery } from './mau';

/** 本月新注册用户；isActive 表示该用户在下月是否活跃（留存口径） */
export type RetentionUser = MauUser;

// 原型快照无数据，mock：样本 12 条 + 按样本复制补齐到 1286 条，下月活跃比例约 27%
const rows: RetentionUser[] = Array.from({ length: 1286 }, (_, i) => {
  const r = retentionSeed[i % retentionSeed.length];
  if (i < retentionSeed.length) return r;
  const no = String(1000000 + ((i * 6151) % 9000000));
  return {
    ...r,
    id: String(i + 1),
    alias: `gcp${no}`,
    loginName: no,
    userId: String(96001 + i),
    isActive: (i * 37) % 100 < 27 ? '1' : '0',
  };
});

/** GET /customer/v1/{orgId}/infos/new-register-user */
export const fetchRetentionList: ListFetcher<RetentionUser, UserMetricQuery> = async (q) => {
  await delay();
  return paginate(filterUserMetric(rows, q), q);
};

/** GET /customer/v1/{orgId}/infos/new-register-user/retention-rate：下月活跃数 / 本月新注册数 */
export async function fetchRetentionRate(q: UserMetricQuery): Promise<number | null> {
  await delay();
  return activePercent(filterUserMetric(rows, q));
}
