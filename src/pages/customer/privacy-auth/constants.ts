import type { Option } from '@/components/SearchForm';
import { ALL_TYPES } from '@/mock/customer/privacyAuth';

/** 「全部」的值为空串，等同于不限 */
export const TERMINAL_OPTIONS: Option[] = ['全部', 'APP', 'PC'].map((v) => ({
  label: v,
  value: v === '全部' ? '' : v,
}));

export const CONSENT_TYPE_OPTIONS: Option[] = [
  { label: '全部', value: '' },
  ...ALL_TYPES.map((v) => ({ label: v, value: v })),
];

export const EMPTY_TEXT = {
  /** 未查询（初始态 / 重置后） */
  idle: '请添加筛选条件后查询数据',
  /** 查询结果为 0 */
  none: '暂无符合条件的数据',
};
