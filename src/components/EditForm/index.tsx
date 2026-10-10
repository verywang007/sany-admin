import type { ReactNode } from 'react';
import styles from './index.module.css';

interface FieldProps {
  label: string;
  required?: boolean;
  /** 占满整行 */
  full?: boolean;
  /** 控件右侧灰色提示 */
  hint?: ReactNode;
  children: ReactNode;
}

/**
 * 编辑视图骨架（协议、公告等页内编辑页共用）：
 * Card 为分组卡片，Field 为「标签：控件 提示」字段行。
 * 编辑页头、栅格等布局类直接引用 index.module.css。
 */
export function Field({ label, required, full, hint, children }: FieldProps) {
  return (
    <div className={`${styles.field} ${full ? styles.full : ''}`}>
      <span className={styles.label}>
        {required && <span className={styles.star}>*</span>}
        {label}
      </span>
      <div className={styles.control}>
        {children}
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
    </div>
  );
}

export function Card({
  title,
  children,
  hidden,
}: {
  title: string;
  children: ReactNode;
  hidden?: boolean;
}) {
  return (
    <section className={styles.card} hidden={hidden}>
      <div className={styles.cardTitle}>{title}</div>
      {children}
    </section>
  );
}
