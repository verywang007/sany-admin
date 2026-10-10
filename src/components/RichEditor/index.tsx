import { useEffect, useRef, type ReactNode } from 'react';
import { App } from 'antd';
import { countText } from '@/utils/html';
import styles from './index.module.css';

interface Tool {
  label: string;
  title: string;
  /** 浏览器原生命令；未提供则提示需接入完整编辑器 */
  command?: 'bold' | 'italic' | 'underline';
}

const TOOL_GROUPS: Tool[][] = [
  [
    { label: 'B', title: '加粗', command: 'bold' },
    { label: 'I', title: '斜体', command: 'italic' },
    { label: 'U', title: '下划线', command: 'underline' },
  ],
  [
    { label: 'H1', title: '一级标题' },
    { label: 'H2', title: '二级标题' },
  ],
  [
    { label: '• 列表', title: '无序列表' },
    { label: '1. 列表', title: '有序列表' },
  ],
  [
    { label: '链接', title: '插入链接' },
    { label: '表格', title: '插入表格' },
  ],
  [{ label: '</> 源码', title: '源码模式' }],
];

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  /** 底部右侧追加的信息（字数之后） */
  footerExtra?: ReactNode;
  /** 精简工具栏（仅 B/I/U、标题、列表），原型中非简体中文编辑器如此 */
  basic?: boolean;
}

/**
 * 原型级富文本编辑器：contenteditable + 简易工具栏。
 * 加粗 / 斜体 / 下划线可用，其余按钮提示需接入完整富文本编辑器（同原型）。
 */
export default function RichEditor({
  value,
  onChange,
  placeholder,
  readOnly,
  footerExtra,
  basic,
}: Props) {
  const { message } = App.useApp();
  const ref = useRef<HTMLDivElement>(null);

  // 外部值变化（切换记录 / 语言）时同步到 DOM；输入产生的变化与 DOM 一致，不会重置光标
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value;
  }, [value]);

  const emit = () =>
    ref.current && onChange(ref.current.innerHTML === '<br>' ? '' : ref.current.innerHTML);

  const run = (tool: Tool) => {
    if (readOnly) return;
    if (tool.command) {
      document.execCommand(tool.command);
      emit();
    } else {
      message.info(`原型演示：${tool.title} 需接入完整富文本编辑器`);
    }
  };

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        {(basic ? TOOL_GROUPS.slice(0, 3) : TOOL_GROUPS).map((group, gi) => (
          <span key={gi} className={styles.group}>
            {gi > 0 && <span className={styles.sep} />}
            {group.map((t) => (
              <button
                key={t.label}
                type="button"
                title={t.title}
                disabled={readOnly}
                className={styles.tool}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => run(t)}
              >
                {t.label}
              </button>
            ))}
          </span>
        ))}
      </div>
      <div
        ref={ref}
        className={`${styles.body} ${readOnly ? styles.readOnly : ''}`}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emit}
      />
      <div className={styles.footer}>
        字数 {countText(value).toLocaleString('en-US')}
        {footerExtra}
      </div>
    </div>
  );
}
