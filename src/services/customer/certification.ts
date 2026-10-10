import { delay, exact, fuzzy, inRange, paginate } from '@/mock/utils';
import { certificationSeed, countrySeed } from '@/mock/customer/certification';
import type { ListFetcher } from '@/types/common';

/** 客户类别：1 个人，2 公司 */
export type CustomerCategory = '1' | '2';
/** 认证状态：0 未认证，1 已认证 */
export type AuthStatus = '0' | '1';
/** 考核状态：0 已剔除，1 考核中 */
export type AssessStatus = '0' | '1';

export interface Country {
  cityCode: string;
  cityName: string;
}

/** CRM 客户 */
export interface CrmCustomer {
  id: string;
  crmCustomerNo: string;
  crmCustomerCategory: CustomerCategory;
  managementUnit: string;
  countryCode: string;
  companyName: string;
  contactPhone: string;
  contactEmail: string;
  contactName: string;
  authStatus: AuthStatus;
  authUserNum: number;
  /** 是否为考核国：1 是，0 否 */
  assessCountryFlag: '0' | '1';
  chargeName: string;
  chargeFlyAccount: string;
  chargeLeaderFlyAccount: string;
  creatorName: string;
  creatorFlyAccount: string;
  creatorLeaderFlyAccount: string;
  crmCreationDate: string;
  assessStatus: AssessStatus;
}

export interface CrmCustomerQuery {
  crmCustomerNo?: string;
  countryCode?: string;
  crmCustomerCategory?: CustomerCategory;
  time?: unknown;
  authStatus?: AuthStatus;
  assessStatus?: AssessStatus;
  assessCountryFlag?: '0' | '1';
  [key: string]: unknown;
}

/** 导入类型：1 考核国家，2 客户信息 */
export type ImportType = 1 | 2;

export interface ImportResult {
  totalCount: number;
  successCount: number;
  failCount: number;
}

const rows: CrmCustomer[] = certificationSeed.map((r) => ({ ...r }));

export async function fetchCountries(): Promise<Country[]> {
  await delay(100);
  return countrySeed;
}

export const fetchCrmCustomerList: ListFetcher<CrmCustomer, CrmCustomerQuery> = async (q) => {
  await delay();
  const list = rows.filter(
    (r) =>
      fuzzy(r.crmCustomerNo, q.crmCustomerNo) &&
      exact(r.countryCode, q.countryCode) &&
      exact(r.crmCustomerCategory, q.crmCustomerCategory) &&
      inRange(r.crmCreationDate, q.time) &&
      exact(r.authStatus, q.authStatus) &&
      exact(r.assessStatus, q.assessStatus) &&
      exact(r.assessCountryFlag, q.assessCountryFlag),
  );
  return paginate(list, q);
};

/** 修改考核状态（单行和批量共用） */
export async function updateAssessStatus(ids: string[], assessStatus: AssessStatus): Promise<void> {
  await delay();
  rows.forEach((r) => {
    if (ids.includes(r.id)) r.assessStatus = assessStatus;
  });
}

/** 刷新（后端重新同步 CRM 数据） */
export async function refreshCrmCustomers(): Promise<void> {
  await delay(400);
}

/** 导入：原型环境不解析文件，按文件大小模拟全部成功 / 部分失败 / 全部失败三种结果 */
export async function importCrmFile(_type: ImportType, file: File): Promise<ImportResult> {
  await delay(600);
  const totalCount = 10;
  const failCount = [0, 2, 10][file.size % 3];
  return { totalCount, failCount, successCount: totalCount - failCount };
}
