import type { Dayjs } from 'dayjs';
import { delay, paginate } from '@/mock/utils';
import { customerStatExtra, customerStatSeed } from '@/mock/customer/customerAnalysis';
import type { ListFetcher } from '@/types/common';

/** 按国家&地区汇总的客户数 */
export interface CustomerStat {
  id: string;
  /** 国家&地区，可能是多个国家用英文逗号拼接，如「加拿大,波多黎哥,美国」 */
  country: string;
  increaseNumber: number;
  totalNumber: number;
}

/** 认证状态（推断：原型下拉未展开，选项与编码未知） */
export type AuthStatus = 'CERTIFIED' | 'UNCERTIFIED';

export interface CustomerStatQuery {
  countryObj?: string;
  time?: unknown;
  authStatus?: AuthStatus;
  [key: string]: unknown;
}

// 原型共 221 行：样本 10 行 + 其余国家补齐
const rows: CustomerStat[] = [
  ...customerStatSeed,
  ...customerStatExtra.map((r, i) => ({ ...r, id: String(customerStatSeed.length + i + 1) })),
];

/** 国家 LOV 的候选项：把合并行拆开 */
export const COUNTRY_LIST: string[] = Array.from(
  new Set(rows.flatMap((r) => r.country.split(','))),
);

const DAY = 86400000;

/**
 * 统计口径的模拟：
 * - 选了时间区间：新增客户数按区间天数占一年的比例折算（总客户数不变）；
 * - 选了认证状态：按 60% 已认证 / 40% 未认证 拆分。
 */
function scale(r: CustomerStat, q: CustomerStatQuery): CustomerStat {
  let { increaseNumber, totalNumber } = r;
  const range = q.time as [Dayjs | null, Dayjs | null] | undefined;
  if (range?.[0] && range[1]) {
    const ratio = Math.min(1, Math.max(0, range[1].diff(range[0]) / (365 * DAY)));
    increaseNumber = Math.round(increaseNumber * ratio);
  }
  if (q.authStatus) {
    const part = (n: number) =>
      q.authStatus === 'CERTIFIED' ? Math.round(n * 0.6) : n - Math.round(n * 0.6);
    increaseNumber = part(increaseNumber);
    totalNumber = part(totalNumber);
  }
  return { ...r, increaseNumber, totalNumber };
}

export const fetchCustomerStatList: ListFetcher<CustomerStat, CustomerStatQuery> = async (q) => {
  await delay();
  const list = rows
    .filter((r) => !q.countryObj || r.country.split(',').includes(q.countryObj))
    .map((r) => scale(r, q));
  return paginate(list, q);
};

export async function fetchCountryLov(keyword: string) {
  await delay(100);
  const kw = keyword.trim().toLowerCase();
  return COUNTRY_LIST.filter((c) => c.toLowerCase().includes(kw)).map((c) => ({ id: c, name: c }));
}
