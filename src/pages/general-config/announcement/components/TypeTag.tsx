import { Tag } from 'antd';
import { ANNOUNCEMENT_TYPE } from '../constants';

/** 公告类型彩色标签 */
export default function TypeTag({ value }: { value: string }) {
  const t = ANNOUNCEMENT_TYPE[value];
  if (!t) return <>{value}</>;
  return (
    <Tag
      bordered={false}
      style={{ background: t.bg, color: t.color, fontSize: 11, marginInlineEnd: 0 }}
    >
      {t.text}
    </Tag>
  );
}
