import type { Lookup } from '@/components/StatusTag';
import type { LangCode } from '@/components/LangTabs/langs';
import { colors } from '@/theme';

/** 公告状态，与隐私/服务协议管理一致；草稿 / 已失效的灰色圆点取自原型 */
export const ANNOUNCEMENT_STATUS: Lookup = {
  DRAFT: { text: '草稿', color: '#bfbfbf' },
  SCHEDULED: { text: '待生效', color: colors.primary },
  PUBLISHED: { text: '已发布', color: '#52c41a' },
  EXPIRED: { text: '已失效', color: '#8c8c8c' },
};

/** 公告类型：文案 + 标签底色 / 文字色（原型取色） */
export const ANNOUNCEMENT_TYPE: Record<string, { text: string; bg: string; color: string }> = {
  sys: { text: '系统通知', bg: '#e4f4fb', color: '#268ba9' },
  maint: { text: '维护公告', bg: '#fff2df', color: '#d8872c' },
  op: { text: '运营公告', bg: '#f1ecff', color: '#815fd0' },
};

export const TYPE_OPTIONS = Object.entries(ANNOUNCEMENT_TYPE).map(([value, { text }]) => ({
  label: text,
  value,
}));
export const STATUS_OPTIONS = Object.entries(ANNOUNCEMENT_STATUS).map(([value, { text }]) => ({
  label: text,
  value,
}));

export type EditMode = 'new' | 'edit' | 'view' | 'copy';

export const EDITOR_PLACEHOLDERS: Record<LangCode, string> = {
  'zh-CN': '请输入简体中文版公告正文',
  'en-US': 'Please enter the notice content in English',
  'id-ID': 'Silakan masukkan konten pengumuman dalam Bahasa Indonesia',
  'zh-TW': '請輸入繁體中文版公告正文',
};

export const TITLE_PLACEHOLDERS: Record<LangCode, string> = {
  'zh-CN': '请输入简体中文版公告标题（不超过 60 字）',
  'en-US': 'Please enter the notice title in English (max 60 characters)',
  'id-ID': 'Silakan masukkan judul pengumuman dalam Bahasa Indonesia (maks. 60 karakter)',
  'zh-TW': '請輸入繁體中文版公告標題（不超過 60 字）',
};
