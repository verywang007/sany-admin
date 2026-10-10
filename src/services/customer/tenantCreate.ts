import dayjs from 'dayjs';
import { delay, exact, fuzzy, inRange, paginate } from '@/mock/utils';
import { tenantCreateSeed } from '@/mock/customer/tenantCreate';
import { CURRENT_USER } from '@/config/app';
import type { ListFetcher } from '@/types/common';

export type TenantType = 'ENTERPRISE' | 'AGENT';

/** 直接创建的租户记录（与租户审核同一后端模型，字段名沿用） */
export interface TenantCreateRecord {
  id: string;
  /** 创建时间 */
  applyTime: string;
  tenantType: TenantType;
  tenantTypeDesc: string;
  /** 租户ID，样本数据均为空 */
  companyId: string;
  /** 租户名称 */
  companyName: string;
  /** 管理员登录账号 */
  applyAccount: string;
  registrationNumber: string;
  countryDesc: string;
  /** 操作人 */
  approvalUserName: string;
  /** 备注说明 */
  applicationDescription: string;
}

export interface TenantCreateQuery {
  times?: unknown;
  tenantType?: TenantType;
  companyName?: string;
  [key: string]: unknown;
}

export interface TenantCreateForm {
  tenantType: TenantType;
  companyName: string;
  applyAccount: string;
  registrationNumber?: string;
  countryDesc?: string;
  applicationDescription?: string;
}

export const TENANT_TYPE_TEXT: Record<TenantType, string> = {
  ENTERPRISE: '企业客户',
  AGENT: '代理商',
};

// 原型共 16 条，与样本一致
let rows: TenantCreateRecord[] = [...tenantCreateSeed];

export const fetchTenantCreateList: ListFetcher<TenantCreateRecord, TenantCreateQuery> = async (
  q,
) => {
  await delay();
  const list = rows.filter(
    (r) =>
      inRange(r.applyTime, q.times) &&
      exact(r.tenantType, q.tenantType) &&
      fuzzy(r.companyName, q.companyName),
  );
  return paginate(list, q);
};

/** 创建租户（推断：原型未提供表单） */
export async function createTenant(form: TenantCreateForm) {
  await delay();
  const record: TenantCreateRecord = {
    id: `new-${Date.now()}`,
    applyTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    tenantType: form.tenantType,
    tenantTypeDesc: TENANT_TYPE_TEXT[form.tenantType],
    companyId: '',
    companyName: form.companyName,
    applyAccount: form.applyAccount,
    registrationNumber: form.registrationNumber ?? '',
    countryDesc: form.countryDesc ?? '',
    approvalUserName: CURRENT_USER.name,
    applicationDescription: form.applicationDescription ?? '',
  };
  // 列表按创建时间倒序
  rows = [record, ...rows];
  return record;
}
