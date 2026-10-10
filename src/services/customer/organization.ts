import dayjs from 'dayjs';
import { delay, expand, fuzzy, paginate } from '@/mock/utils';
import { organizationSeed } from '@/mock/customer/organization';
import type { ListFetcher } from '@/types/common';

/** 客户组织 */
export interface Organization {
  id: string;
  organizationName: string;
  /** 组织关联客户编码 */
  crmCustomerNo: string;
  /** 成员数量 */
  orgUserSize: number;
  creationDate: string;
}

/** 组织成员（原型未提供，推断） */
export interface OrgMember {
  id: string;
  userName: string;
  account: string;
  /** 角色：管理员 / 成员 */
  roleName: string;
  joinDate: string;
}

export interface OrganizationQuery {
  crmCustomerNo?: string;
  organizationName?: string;
  [key: string]: unknown;
}

export interface OrganizationForm {
  organizationName: string;
  crmCustomerNo: string;
}

const FMT = 'YYYY-MM-DD HH:mm:ss';

// 原型共 19407 条：样本 20 条，其余复制补齐；副本时间顺延到更早，保持按创建时间倒序
const rows: Organization[] = expand(organizationSeed, 19407, (r, n, i) => ({
  ...r,
  id: String(i + 1),
  crmCustomerNo: String(Number(r.crmCustomerNo) - n * 37).padStart(10, '0'),
  creationDate: dayjs(r.creationDate)
    .subtract(n * 3, 'day')
    .format(FMT),
}));

export const fetchOrganizationList: ListFetcher<Organization, OrganizationQuery> = async (q) => {
  await delay();
  const list = rows.filter(
    (r) => fuzzy(r.crmCustomerNo, q.crmCustomerNo) && fuzzy(r.organizationName, q.organizationName),
  );
  return paginate(list, q);
};

export async function createOrganization(form: OrganizationForm): Promise<void> {
  await delay();
  const crmCustomerNo = form.crmCustomerNo.trim();
  if (rows.some((r) => r.crmCustomerNo === crmCustomerNo)) throw new Error('该客户编码已关联组织');
  rows.unshift({
    id: `new-${Date.now()}`,
    organizationName: form.organizationName.trim(),
    crmCustomerNo,
    orgUserSize: 0,
    creationDate: dayjs().format(FMT),
  });
}

const FIRST_NAMES = ['Budi', 'Rahul', 'Somchai', 'Agus', 'Priya', 'Joao', 'Dewi', 'Arjun'];

/** 按组织生成确定性的成员列表（原型环境） */
export async function fetchOrgMembers(org: Organization): Promise<OrgMember[]> {
  await delay(150);
  const seed = Number(org.crmCustomerNo.slice(-4)) || 0;
  return Array.from({ length: org.orgUserSize }, (_, i) => ({
    id: `${org.id}-${i + 1}`,
    userName: FIRST_NAMES[(seed + i) % FIRST_NAMES.length],
    account: `+62812${String(seed * 7 + i * 131)
      .padStart(7, '0')
      .slice(-7)}`,
    roleName: i === 0 ? '管理员' : '成员',
    joinDate: dayjs(org.creationDate).add(i, 'day').format(FMT),
  }));
}
