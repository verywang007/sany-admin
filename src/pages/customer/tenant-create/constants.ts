import type { Option } from '@/components/SearchForm';

/** 租户类型（编码为推断，原型只展示文案） */
export const TENANT_TYPE_OPTIONS: Option[] = [
  { label: '企业客户', value: 'ENTERPRISE' },
  { label: '代理商', value: 'AGENT' },
];

/** 国家/地区：取自样本数据，另补常见站点国家（推断） */
export const COUNTRY_OPTIONS: Option[] = [
  '中国',
  '中国香港',
  '马来西亚',
  '印度尼西亚',
  '菲律宾',
  '泰国',
  '新加坡',
  '越南',
  '沙特阿拉伯',
  '俄罗斯联邦',
].map((c) => ({ label: c, value: c }));
