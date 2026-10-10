import { delay, expand, fuzzy, paginate } from '@/mock/utils';
import { deviceAdminSeed, telCodeSeed } from '@/mock/customer/deviceAdmin';
import type { ListFetcher } from '@/types/common';

/** 设备管理员配置 */
export interface DeviceAdmin {
  id: string;
  crmCustomerName: string;
  crmCustomerNo: string;
  adminName: string;
  /** 国际区号，如 62；与 adminPhone 互为条件必填 */
  internationalTelCode: string | null;
  adminPhone: string;
  adminMysanyNo: string;
}

export type DeviceAdminForm = Omit<DeviceAdmin, 'id'> & { id?: string };

export interface DeviceAdminQuery {
  crmCustomerName?: string;
  crmCustomerNo?: string;
  adminMysanyNo?: string;
  [key: string]: unknown;
}

/** 列表展示用：(区号)号码 */
export const formatAdminPhone = (r: Pick<DeviceAdmin, 'internationalTelCode' | 'adminPhone'>) =>
  (r.internationalTelCode ? `(${r.internationalTelCode})` : '') + (r.adminPhone ?? '');

// 原型共 1282 条：样本 20 条，其余复制补齐
let rows = expand(deviceAdminSeed, 1282, (r, _n, i) => ({ ...r, id: String(1014 + i) }));
let seq = 1014 + rows.length;

export const fetchDeviceAdminList: ListFetcher<DeviceAdmin, DeviceAdminQuery> = async (q) => {
  await delay();
  const list = rows.filter(
    (r) =>
      fuzzy(r.crmCustomerName, q.crmCustomerName) &&
      fuzzy(r.crmCustomerNo, q.crmCustomerNo) &&
      fuzzy(r.adminMysanyNo, q.adminMysanyNo),
  );
  return paginate(list, q);
};

/** 新增 / 编辑共用：有 id 为编辑 */
export async function saveDeviceAdmin(form: DeviceAdminForm) {
  await delay();
  if (form.id) {
    rows = rows.map((r) => (r.id === form.id ? { ...r, ...form, id: r.id } : r));
  } else {
    rows = [{ ...form, id: String(seq++) }, ...rows];
  }
}

export async function deleteDeviceAdmin(id: string) {
  await delay();
  rows = rows.filter((r) => r.id !== id);
}

/** 导入（原型：POST .../customer-device-managers/import，FormData 字段 file），mock 只校验后延迟 */
export async function importDeviceAdmin(file: File) {
  const form = new FormData();
  form.append('file', file);
  await delay(500);
}

export async function fetchTelCodeOptions() {
  await delay(50);
  return telCodeSeed.map((c) => ({
    value: c.internationalCallPrefix,
    label: `${c.cityName}(${c.internationalCallPrefix})`,
  }));
}
