import type { Lookup } from '@/components/StatusTag';

/*
 * 以下值集在原型中来自 HZERO 值集接口（快照里没有取到具体值），
 * 编码沿用源码中的值集编码，选项内容为推断，接入真实接口时替换。
 */

/** CUSTOMER.INFO.ROLE 角色 */
export const ROLE: Lookup = {
  NORMAL: { text: '非管理员' },
  ADMIN: { text: '管理员' },
};

/** CUSTOME_IDENTITY 身份 */
export const IDENTITY: Lookup = {
  '1': { text: '机主' },
  '2': { text: '机手' },
  '3': { text: '设备管理员' },
  '4': { text: '服务工程师' },
};

/** CUSTOMER.TELNET.AUTH_STATUS_CODE 认证状态 */
export const AUTH_STATUS: Lookup = {
  '0': { text: '未认证' },
  '1': { text: '已认证' },
};

/** CUSTOMER.TELNET.AUTH_TYPE_CODE 认证类型（与源码常量 UN_AUTH/PERSIONAL_AUTH/ENTERPRISE_AUTH/AGENT_AUTH 对应） */
export const AUTH_TYPE: Lookup = {
  '0': { text: '未认证' },
  '1': { text: '个人认证' },
  '2': { text: '企业认证' },
  '3': { text: '代理商认证' },
};

/** CUSTOMER.CLASSIFICATION 客户类别 */
export const CLASSIFICATION: Lookup = {
  '1': { text: '终端客户' },
  '2': { text: '代理商' },
  '3': { text: '大客户' },
};

export const LABEL: Lookup = {
  '0': { text: '否' },
  '1': { text: '是' },
};

export const LOCK_STATUS: Lookup = {
  UNLOCK: { text: '激活' },
  LOCK: { text: '已锁定' },
};

/** 页头认证日期快捷选项 */
export const QUICK_DATES = [
  { value: 1, label: '今日' },
  { value: 2, label: '昨日' },
  { value: 3, label: '本周' },
  { value: 4, label: '本月' },
] as const;

/** 开启演示模式时写死的演示设备号（沿用原系统） */
export const DEMO_DEVICE_NO = 'TC2050CB9073';
