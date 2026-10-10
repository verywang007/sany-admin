import type { Lookup } from '@/components/StatusTag';
import type { LangCode } from '@/components/LangTabs';
import type { DocKind } from '@/services/general-config/agreement';
import { colors } from '@/theme';

/** 值集 MYSANY.AGREEMENT_RELEASE_STATUS；草稿 / 已失效的灰色圆点取自原型 */
export const AGREEMENT_STATUS: Lookup = {
  DRAFT: { text: '草稿', color: '#bfbfbf' },
  SCHEDULED: { text: '待生效', color: colors.primary },
  PUBLISHED: { text: '已发布', color: '#52c41a' },
  EXPIRED: { text: '已失效', color: '#8c8c8c' },
};

export const SITES = ['新加坡', '法兰克福'];
export const SITE_OPTIONS = SITES.map((s) => ({ label: s, value: s }));
export const STATUS_OPTIONS = Object.entries(AGREEMENT_STATUS).map(([value, { text }]) => ({
  label: text,
  value,
}));

export type EditMode = 'new' | 'edit' | 'view' | 'copy';
export type MainTab = DocKind | 'popup';

export const MAIN_TABS: { key: MainTab; label: string }[] = [
  { key: 'privacy', label: '隐私政策' },
  { key: 'service', label: '用户服务协议' },
  { key: 'popup', label: '变更内容弹窗' },
];
export const tabLabel = (k: MainTab) => MAIN_TABS.find((t) => t.key === k)?.label ?? k;

export const DOC_PLACEHOLDERS: Record<DocKind, Record<LangCode, string>> = {
  privacy: {
    'zh-CN': '请输入简体中文版隐私政策正文',
    'en-US': 'Please enter the English version of the privacy policy',
    'id-ID': 'Silakan masukkan teks Kebijakan Privasi versi Bahasa Indonesia',
    'zh-TW': '請輸入繁體中文版隱私權政策正文',
  },
  service: {
    'zh-CN': '请输入简体中文版用户服务协议正文',
    'en-US': 'Please enter the English version of the user service agreement',
    'id-ID': 'Silakan masukkan teks Perjanjian Layanan Pengguna versi Bahasa Indonesia',
    'zh-TW': '請輸入繁體中文版用戶服務協議正文',
  },
};

export const POPUP_PLACEHOLDERS: Partial<Record<LangCode, string>> = {
  'id-ID': 'Silakan masukkan teks Bahasa Indonesia untuk isi popup',
  'zh-TW': '請輸入繁體中文版彈窗正文',
};

export const PHONE_TOKEN = '{{客服电话}}';
