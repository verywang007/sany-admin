import { Badge, Tag } from 'antd';

export interface LookupItem {
  text: string;
  /** 色值或 antd 预设色名 */
  color?: string;
}

/** 值集：编码 → 展示信息 */
export type Lookup = Record<string, LookupItem>;

interface Props {
  lookup: Lookup;
  value: string | undefined | null;
  /** tag：彩色标签；dot：圆点 + 文字 */
  variant?: 'tag' | 'dot';
}

/** 按值集渲染状态，未知编码原样显示 */
export default function StatusTag({ lookup, value, variant = 'tag' }: Props) {
  if (value === undefined || value === null || value === '') return null;
  const item = lookup[value] ?? { text: value };
  if (variant === 'dot') return <Badge color={item.color ?? '#bfbfbf'} text={item.text} />;
  return (
    <Tag color={item.color} bordered={false}>
      {item.text}
    </Tag>
  );
}
