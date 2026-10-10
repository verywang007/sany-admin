import { Dropdown, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { Lookup } from '@/components/StatusTag';
import styles from '../index.module.css';

interface Props {
  /** 显示文本，空值显示 -- */
  text?: string;
  /** 点击整格（弹窗编辑） */
  onClick?: () => void;
  /** 提供则点击弹出下拉菜单，选中即提交（无确认） */
  menu?: Lookup;
  onSelect?: (key: string) => void;
  /** 溢出时显示 tooltip */
  tooltip?: boolean;
}

/** 可编辑单元格：左侧单行省略的值，右侧铅笔图标 */
export default function EditCell({ text, onClick, menu, onSelect, tooltip }: Props) {
  const label = text || '--';
  const cell = (
    <div className={styles.editCell} onClick={onClick}>
      <span className={styles.editValue}>
        {tooltip ? <Tooltip title={label}>{label}</Tooltip> : label}
      </span>
      <EditOutlined className={styles.editIcon} />
    </div>
  );
  if (!menu) return cell;
  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: Object.entries(menu).map(([key, { text: t }]) => ({ key, label: t })),
        onClick: ({ key }) => onSelect?.(key),
      }}
    >
      {cell}
    </Dropdown>
  );
}
