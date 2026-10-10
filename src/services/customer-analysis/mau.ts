import type { Dayjs } from 'dayjs';
import { delay, exact, paginate } from '@/mock/utils';
import { countryLov, mauSeed } from '@/mock/customer-analysis/mau';
import type { ListFetcher } from '@/types/common';

/** 客户分析报表中的用户行（月活跃用户 / 用户留存率共用） */
export interface MauUser {
  id: string;
  /** 昵称 */
  alias: string;
  loginName: string;
  contactPhone: string;
  email: string;
  /** 大区 */
  regionName: string;
  country: string;
  /** 印尼试点用户：'1' 是 / '0' 否 */
  label: '1' | '0';
  /** 是否活跃：'1' 是 / '0' 否 */
  isActive: '1' | '0';
  appVersion: string;
  userId: string;
}

/** 查询条件：yearMonth 为月份选择器的 Dayjs，countryCodes 为 LOV 选中的 citycode 列表 */
export interface UserMetricQuery {
  yearMonth?: Dayjs | null;
  countryCodes?: string[];
  label?: '1' | '0';
  [key: string]: unknown;
}

export interface CountryOption {
  citycode: string;
  cityname: string;
}

/** LOV CUSTOMER.COUNTRY */
export async function fetchCountryLov(): Promise<CountryOption[]> {
  await delay(50);
  return countryLov;
}

/**
 * 按查询条件过滤（两张报表共用）。
 * 真实接口参数：yearMonth 格式化为 YYYY-MM，countryCodes 拼接为逗号字符串；
 * mock 样本不区分月份，yearMonth 仅透传。
 */
export function filterUserMetric<T extends MauUser>(rows: T[], q: UserMetricQuery) {
  const names = (q.countryCodes ?? [])
    .map((c) => countryLov.find((o) => o.citycode === c)?.cityname)
    .filter(Boolean);
  return rows.filter(
    (r) => (names.length === 0 || names.includes(r.country)) && exact(r.label, q.label),
  );
}

/** 活跃用户占比（百分数，保留 2 位）；没有数据时返回 null，页面显示 -- */
export function activePercent(rows: MauUser[]) {
  if (rows.length === 0) return null;
  const active = rows.filter((r) => r.isActive === '1').length;
  return Math.round((active / rows.length) * 10000) / 100;
}

// 原型快照总数 95258：前 10 条为快照样本，其余按样本复制，活跃比例约 9%
const rows: MauUser[] = Array.from({ length: 95258 }, (_, i) => {
  const r = mauSeed[i % mauSeed.length];
  if (i < mauSeed.length) return r;
  const no = String(1000000 + ((i * 7919) % 9000000));
  return {
    ...r,
    id: String(i + 1),
    alias: `gcp${no}`,
    loginName: no,
    userId: String(24311 + i),
    isActive: (i * 7919) % 10000 < 899 ? '1' : '0',
  };
});

/** GET /customer/v1/{orgId}/infos/active-user */
export const fetchMauList: ListFetcher<MauUser, UserMetricQuery> = async (q) => {
  await delay();
  return paginate(filterUserMetric(rows, q), q);
};

/** GET /customer/v1/{orgId}/infos/active-user/active-rate：月活跃率=本月活跃用户数/本月用户总数 */
export async function fetchActiveRate(q: UserMetricQuery): Promise<number | null> {
  await delay();
  return activePercent(filterUserMetric(rows, q));
}
