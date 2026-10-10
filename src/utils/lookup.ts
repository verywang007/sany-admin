import type { Lookup } from '@/components/StatusTag';
import type { Option } from '@/components/SearchForm';

/**
 * 值集 → 下拉选项。
 * 注意：数字形式的编码（'0'、'1'）在对象里会按数值升序排列，需要指定顺序时传 order。
 */
export const toOptions = (lookup: Lookup, order: string[] = Object.keys(lookup)): Option[] =>
  order.map((value) => ({ value, label: lookup[value]?.text ?? value }));

/** 编码 → 文案，未知编码原样返回 */
export const lookupText = (lookup: Lookup, code: string | undefined | null) =>
  code ? (lookup[code]?.text ?? code) : '';
