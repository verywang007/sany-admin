import type { Lookup } from '@/components/StatusTag';

export const CUSTOMER_CATEGORY: Lookup = { '1': { text: '个人' }, '2': { text: '公司' } };
export const AUTH_STATUS: Lookup = { '0': { text: '未认证' }, '1': { text: '已认证' } };
export const ASSESS_STATUS: Lookup = { '0': { text: '已剔除' }, '1': { text: '考核中' } };
/** 是否为考核国（选项顺序与原型一致：是在前） */
export const ASSESS_COUNTRY_FLAG: Lookup = { '1': { text: '是' }, '0': { text: '否' } };

/** 所有提示统一用 notification，标题固定为“消息提示” */
export const NOTICE_TITLE = '消息提示';
