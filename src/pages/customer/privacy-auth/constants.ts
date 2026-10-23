import type { Option } from '@/components/SearchForm';
import type { Lookup } from '@/components/StatusTag';
import { ALL_SCENES, ALL_TYPES, PC_SCENES, PC_TYPES } from '@/mock/customer/privacyAuth';
import { toOptions } from '@/utils/lookup';

/** 「全部」的值为空串，等同于不限 */
export const TERMINAL_OPTIONS: Option[] = ['全部', 'APP', 'PC'].map((v) => ({
  label: v,
  value: v === '全部' ? '' : v,
}));

export const CONSENT_TYPE_OPTIONS: Option[] = [
  { label: '全部', value: '' },
  ...ALL_TYPES.map((v) => ({ label: v, value: v })),
];

/** 终端选 PC 时的同意类型选项：PC 端只有协议类授权 */
export const PC_CONSENT_TYPE_OPTIONS: Option[] = [
  { label: '全部', value: '' },
  ...PC_TYPES.map((v) => ({ label: v, value: v })),
];

export const isPcConsentType = (v: unknown) => !v || PC_TYPES.includes(String(v));

/** 授权场景：用户在哪个环节、通过什么界面做出同意（PRD §6.3） */
export const SCENE: Lookup = {
  FIRST_LAUNCH: { text: '首次启动' },
  REGISTER: { text: '注册' },
  LOGIN: { text: '登录' },
  VERSION_UPDATE: { text: '协议改版重新同意' },
  SETTINGS: { text: '设置页主动开启' },
  FEATURE_ENTRY: { text: '功能入口单独授权' },
};

export const SCENE_OPTIONS: Option[] = [
  { label: '全部', value: '' },
  ...toOptions(SCENE, ALL_SCENES),
];

/** 终端选 PC 时的授权场景选项：PC 端没有首次启动、设置页、功能入口类场景 */
export const PC_SCENE_OPTIONS: Option[] = [
  { label: '全部', value: '' },
  ...toOptions(SCENE, PC_SCENES),
];

export const isPcScene = (v: unknown) => !v || PC_SCENES.includes(String(v));

/** 空值占位：来源采集上线前的记录、权限类授权的协议哈希等 */
export const NONE = '—';

/** IP 脱敏：保留前两段。完整 IP 只在导出文件中提供 */
export const maskIp = (ip: string) =>
  ip ? ip.split('.').slice(0, 2).concat('*', '*').join('.') : '';

export const EMPTY_TEXT = {
  /** 未查询（初始态 / 重置后） */
  idle: '请添加筛选条件后查询数据',
  /** 查询结果为 0 */
  none: '暂无符合条件的数据',
};
