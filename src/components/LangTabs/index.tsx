import type { CSSProperties, ReactNode } from 'react';
import { colors } from '@/theme';
import type { LangCode, LangOption } from './langs';
import { LANGS } from './langs';
import styles from './index.module.css';

export type { LangCode, LangOption } from './langs';

interface Props {
  value: LangCode;
  onChange: (code: LangCode) => void;
  /** 右侧灰色提示 */
  hint?: ReactNode;
  /** 前缀文案，默认「语言版本：」 */
  prefix?: ReactNode;
  disabled?: boolean;
  langs?: LangOption[];
  className?: string;
  style?: CSSProperties;
}

/** 多语言胶囊页签：「语言版本：简体中文 / English / …」+ 提示，用于按语言维护正文的编辑区 */
export default function LangTabs({
  value,
  onChange,
  hint,
  prefix = '语言版本：',
  disabled,
  langs = LANGS,
  className,
  style,
}: Props) {
  return (
    <div
      className={`${styles.bar} ${className ?? ''}`}
      style={{ '--lang-primary': colors.primary, ...style } as CSSProperties}
    >
      <span className={styles.prefix}>{prefix}</span>
      {langs.map((l) => (
        <button
          key={l.code}
          type="button"
          disabled={disabled}
          className={`${styles.tab} ${l.code === value ? styles.active : ''}`}
          onClick={() => onChange(l.code)}
        >
          {l.label}
        </button>
      ))}
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
