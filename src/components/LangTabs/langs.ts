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
