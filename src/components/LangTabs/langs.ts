/** 内容多语言编码（协议、公告等按语言分别维护正文） */
export type LangCode = 'zh-CN' | 'en-US' | 'id-ID' | 'zh-TW';

export interface LangOption {
  code: LangCode;
  label: string;
}

export const LANGS: LangOption[] = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'en-US', label: 'English' },
  { code: 'id-ID', label: 'Bahasa Indonesia' },
  { code: 'zh-TW', label: '繁體中文' },
];

export const langLabel = (code: string) => LANGS.find((l) => l.code === code)?.label ?? code;

/**
 * 系统语言：按浏览器 / 操作系统语言匹配内容语言，匹配不到返回 undefined（由调用方回退默认语言）。
 * 繁体（zh-TW / zh-HK / zh-Hant）→ 繁體中文；其余 zh → 简体中文；id / in → 印尼语；en → English
 */
export function getSystemLang(): LangCode | undefined {
  const tag = (typeof navigator === 'undefined' ? '' : navigator.language).toLowerCase();
  if (/^zh-(tw|hk|mo|hant)/.test(tag)) return 'zh-TW';
  if (tag.startsWith('zh')) return 'zh-CN';
  if (tag.startsWith('id') || tag.startsWith('in')) return 'id-ID';
  if (tag.startsWith('en')) return 'en-US';
  return undefined;
}
