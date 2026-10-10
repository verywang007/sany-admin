import dayjs from 'dayjs';
import { delay, exact, fuzzy, inRange, paginate } from '@/mock/utils';
import { accountSeed, countryTree } from '@/mock/customer/account';
import type { ListFetcher } from '@/types/common';

/** 已绑定的客户编码 */
export interface CrmBind {
  id: string;
  crmCustomerNo: string;
}

/** 客户账号（对应 /customer/v1/{org}/infos/page 的行） */
export interface Account {
  id: string;
  userId: string;
  tenantId: string;
  /** 昵称 */
  alias: string;
  loginName: string;
  /** 登录类型 */
  firstLoginMethod: string;
  internationalCallPrefix: string;
  contactPhone: string;
  email: string;
  regionName: string;
  nationalRegionName: string;
  country: string;
  countryCode: string;
  /** 值集 CUSTOMER.INFO.ROLE */
  role: string;
  /** 是否演示模式：0 否 1 是 */
  demoStatus: number;
  /** 值集 CUSTOME_IDENTITY，空为无身份 */
  identity: string;
  /** 印尼试点用户：0 否 1 是 */
  label: string;
  appVersion: string;
  lastActiveTime: string;
  /** 值集 CUSTOMER.CLASSIFICATION */
  crmCustomerClassification: string;
  /** 认证状态：1 已认证 */
  authStatus: number;
  /** 值集 CUSTOMER.TELNET.AUTH_TYPE_CODE */
  authTypeCode: string;
  crmBindList: CrmBind[];
  crmCustomerNo: string;
  starNum: number;
  points: number;
  lockStatusCode: 'UNLOCK' | 'LOCK';
  lastLoginTime: string;
  creationDate: string;
  authDate: string;
  serveRecruitmentPhone: string;
  /** 已审核设备数 */
  adoptTotal: number;
}

export interface CountryNode {
  code: string;
  name: string;
  internationalCallPrefix?: string;
  childNodes?: CountryNode[];
}

export interface AccountQuery {
  /** 注册日期 */
  time?: unknown;
  /** 最近登录日期 */
  time1?: unknown;
  /** 认证日期 */
  time2?: unknown;
  /** 活跃日期 */
  time3?: unknown;
  countryCodes?: string[];
  userIds?: string;
  label?: string;
  /** 身份多选，'0' 表示无身份 */
  identity?: string[];
  phone?: string;
  email?: string;
  crmCustomerNo?: string;
  /** 昵称/登录用户名 */
  alias?: string;
  authStatus?: string;
  authType?: string;
  lockStatus?: string;
  deviceState?: boolean;
  orderByKey?: keyof Account;
  orderByType?: 'asc' | 'desc';
  [key: string]: unknown;
}

const rows: Account[] = accountSeed.map((r) => ({ ...r, crmBindList: [...r.crmBindList] }));

const find = (userId: string) => {
  const row = rows.find((r) => r.userId === userId);
  if (!row) throw new Error('用户不存在');
  return row;
};

export const fetchAccountList: ListFetcher<Account, AccountQuery> = async (q) => {
  await delay();
  const list = rows.filter(
    (r) =>
      inRange(r.creationDate, q.time) &&
      inRange(r.lastLoginTime, q.time1) &&
      inRange(r.authDate, q.time2) &&
      inRange(r.lastActiveTime, q.time3) &&
      (!q.countryCodes?.length || q.countryCodes.includes(r.countryCode)) &&
      fuzzy(r.userId, q.userIds) &&
      exact(r.label, q.label) &&
      (!q.identity?.length || q.identity.includes(r.identity || '0')) &&
      fuzzy(r.contactPhone, q.phone) &&
      fuzzy(r.email, q.email) &&
      fuzzy(
        [r.crmCustomerNo, ...r.crmBindList.map((b) => b.crmCustomerNo)].join(','),
        q.crmCustomerNo,
      ) &&
      // 原系统同时按 alias 和 loginName 发送
      (fuzzy(r.alias, q.alias) || fuzzy(r.loginName, q.alias)) &&
      exact(String(r.authStatus), q.authStatus) &&
      exact(r.authTypeCode, q.authType) &&
      exact(r.lockStatusCode, q.lockStatus) &&
      (!q.deviceState || r.adoptTotal > 0),
  );
  const { orderByKey: key, orderByType: dir } = q;
  if (key && dir) {
    list.sort((a, b) => {
      const c = String(a[key]).localeCompare(String(b[key]));
      return dir === 'asc' ? c : -c;
    });
  }
  return paginate(list, q);
};

export async function fetchCountryTree() {
  await delay(50);
  return countryTree;
}

/** 有国际区号的国家（对应 /citys/page） */
export async function fetchCallPrefixes() {
  await delay(50);
  const out: { cityName: string; internationalCallPrefix: string }[] = [];
  const walk = (nodes: CountryNode[]) =>
    nodes.forEach((n) => {
      if (n.internationalCallPrefix)
        out.push({ cityName: n.name, internationalCallPrefix: n.internationalCallPrefix });
      if (n.childNodes) walk(n.childNodes);
    });
  walk(countryTree);
  return out;
}

export async function updateEmail(userId: string, email: string) {
  await delay();
  find(userId).email = email;
}

export async function updatePhone(userId: string, phone: string, internationalCallPrefix?: string) {
  await delay();
  Object.assign(find(userId), {
    contactPhone: phone,
    internationalCallPrefix: internationalCallPrefix ?? '',
  });
}

/** 单元格下拉修改：角色 / 身份 / 印尼试点用户 */
export async function updateField(
  userId: string,
  field: 'role' | 'identity' | 'label',
  value: string,
) {
  await delay();
  find(userId)[field] = value;
}

export async function setLockStatus(userId: string, lock: boolean) {
  await delay();
  find(userId).lockStatusCode = lock ? 'LOCK' : 'UNLOCK';
}

export async function setDemoStatus(userId: string, demoStatus: 0 | 1) {
  await delay();
  find(userId).demoStatus = demoStatus;
}

export async function resetPassword(userId: string, password: string) {
  await delay();
  find(userId);
  void password;
}

export interface CrmInfo {
  /** 1 个人 2 企业 */
  crmCustomerCategory: number;
  crmCustomerNo: string;
}

/**
 * 按客户编码/合同编码查询 CRM 客户（query-info-crm）。
 * mock 规则：8 位以上数字视为有效，01 开头为个人客户，其余为企业客户。
 */
export async function queryCrmInfo(code: string, customerCountryCode: string): Promise<CrmInfo> {
  await delay();
  void customerCountryCode;
  const c = code.trim();
  if (!/^\d{8,}$/.test(c)) throw new Error('未查询到该客户编码');
  return { crmCustomerCategory: c.startsWith('01') ? 1 : 2, crmCustomerNo: c };
}

export interface AuthParams {
  role: 'NORMAL' | 'ADMIN';
  authType: number;
  crmCustomerNo: string;
  infoId: string;
}

/** 个人认证（personal-auth）/ 企业认证（enterprise-auth） */
export async function authUser(p: AuthParams) {
  await delay();
  const row = rows.find((r) => r.id === p.infoId);
  if (!row) throw new Error('用户不存在');
  if (row.crmBindList.some((b) => b.crmCustomerNo === p.crmCustomerNo))
    throw new Error('该客户编码已绑定');
  row.crmBindList.push({ id: `${row.id}-${Date.now()}`, crmCustomerNo: p.crmCustomerNo });
  Object.assign(row, {
    authStatus: 1,
    authTypeCode: String(p.authType),
    role: p.role,
    crmCustomerNo: row.crmCustomerNo || p.crmCustomerNo,
    authDate: row.authDate || dayjs().format('YYYY-MM-DD HH:mm:ss'),
  });
}

const clearAuth = (row: Account) =>
  Object.assign(row, {
    authStatus: 0,
    authTypeCode: '0',
    crmCustomerNo: '',
    authDate: '',
    crmCustomerClassification: '',
  });

/** 取消认证：解绑一个客户编码（DELETE /crms），全部解绑后变为未认证 */
export async function unbindCrm(customerInfoId: string, customerInfoCrmId: string) {
  await delay();
  const row = rows.find((r) => r.id === customerInfoId);
  if (!row) throw new Error('用户不存在');
  row.crmBindList = row.crmBindList.filter((b) => b.id !== customerInfoCrmId);
  if (!row.crmBindList.length) clearAuth(row);
  else row.crmCustomerNo = row.crmBindList[0].crmCustomerNo;
}

/** 批量解绑（infos/batch-delete/user） */
export async function batchUnbind(ids: string[]) {
  await delay();
  rows
    .filter((r) => ids.includes(r.id))
    .forEach((r) => {
      r.crmBindList = [];
      clearAuth(r);
    });
}

/** 批量导入（crms/batch-regist-excel），原系统返回导入结果文件 */
export async function importAccounts(file: File) {
  await delay(400);
  void file;
}
