import type { ReactNode } from 'react';
import styles from './index.module.css';

interface Props {
  /** 页头标题（可与菜单名不同，以业务原型为准） */
  title: ReactNode;
  /** 页头右侧操作区 */
  extra?: ReactNode;
  /** 内容区是否包一层白色卡片，默认 true；需要多张卡片时置为 false 自行使用 <PageCard> */
  card?: boolean;
  children?: ReactNode;
}

/** 页面骨架：白色页头 + 灰底内容区，与 HZERO 的 page-head / page-content 对应 */
export default function PageContainer({ title, extra, card = true, children }: Props) {
  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <span className={styles.title}>{title}</span>
        {extra && <div className={styles.extra}>{extra}</div>}
      </div>
      <div className={styles.body}>{card ? <PageCard>{children}</PageCard> : children}</div>
    </div>
  );
}

interface CardProps {
  title?: ReactNode;
  extra?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function PageCard({ title, extra, className, children }: CardProps) {
  return (
    <section className={`${styles.card} ${className ?? ''}`}>
      {(title || extra) && (
        <div className={styles.cardHead}>
          <div className={styles.cardTitle}>{title}</div>
          {extra && <div className={styles.extra}>{extra}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
