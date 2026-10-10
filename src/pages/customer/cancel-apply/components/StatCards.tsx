import type { ReactNode } from 'react';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  HourglassOutlined,
} from '@ant-design/icons';
import type { AccountCancelStatus } from '@/constants/accountCancel';
import type { CancelApplyStats } from '@/services/customer/cancelApply';
import { colors } from '@/theme';
import styles from '../index.module.css';

interface CardDef {
  key: keyof CancelApplyStats;
  /** 点击后写入「注销状态」查询条件 */
  filter: AccountCancelStatus;
  name: string;
  note: string;
  color: string;
  icon: ReactNode;
}

// 原型只有 CSS 和脚本、HTML 缺失；名称按方案 §7.2，备注文案为补充
const CARDS: CardDef[] = [
  {
    key: 'pending',
    filter: 'PENDING',
    name: '待审核',
    note: '需人工审核处理',
    color: colors.warning,
    icon: <ClockCircleOutlined />,
  },
  {
    key: 'cooling',
    filter: 'COOLING',
    name: '冷静期',
    note: '期满后自动执行注销',
    color: colors.blue,
    icon: <HourglassOutlined />,
  },
  {
    key: 'failed',
    filter: 'FAILED',
    name: '失败待重试',
    note: '需人工重试失败子任务',
    color: colors.purple,
    icon: <ExclamationCircleOutlined />,
  },
  {
    key: 'cancelledThisMonth',
    filter: 'CANCELLED',
    name: '本月已完成',
    note: '本月完成注销的申请',
    color: colors.success,
    icon: <CheckCircleOutlined />,
  },
];

interface Props {
  stats?: CancelApplyStats;
  /** 当前查询的注销状态，相同的卡片高亮 */
  active?: string;
  onSelect: (status: AccountCancelStatus) => void;
}

export default function StatCards({ stats, active, onSelect }: Props) {
  return (
    <div className={styles.cards}>
      {CARDS.map((c) => (
        <div
          key={c.key}
          role="button"
          tabIndex={0}
          className={`${styles.card} ${active === c.filter ? styles.cardActive : ''}`}
          onClick={() => onSelect(c.filter)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(c.filter);
            }
          }}
        >
          <div>
            <div className={styles.cardName}>{c.name}</div>
            <div className={styles.cardValue}>
              {stats ? stats[c.key] : '-'}
              <small>单</small>
            </div>
            <div className={styles.cardNote}>{c.note}</div>
          </div>
          <span
            className={styles.cardIcon}
            style={{ color: c.color, background: `color-mix(in srgb, ${c.color} 14%, #fff)` }}
          >
            {c.icon}
          </span>
        </div>
      ))}
    </div>
  );
}
