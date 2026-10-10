import { LANGS, type LangCode } from '@/components/LangTabs/langs';
import type { AgreementForm } from '@/services/general-config/agreement';
import { isBlankHtml } from '@/utils/html';
import { PHONE_TOKEN, tabLabel, type MainTab } from './constants';

export interface ValidateError {
  tab: MainTab;
  lang?: LangCode;
  message: string;
}

/** 提交发布校验（顺序同原型，命中即停） */
export function validateForSubmit(
  form: AgreementForm,
  activeLang: Record<MainTab, LangCode>,
): ValidateError | null {
  const { content } = form;

  // 1. 版本号必填（同一 Tab 下各语言版本号联动，检查当前语言即可）
  for (const tab of ['privacy', 'service'] as const) {
    if (!content[tab][activeLang[tab]].version.trim()) {
      return { tab, message: `「${tabLabel(tab)}」版本号不能为空` };
    }
  }

  // 2. 全部语言必须填写标题与正文
  const missing: Record<MainTab, LangCode[]> = {
    privacy: LANGS.map((l) => l.code).filter(
      (c) => !content.privacy[c].title.trim() || isBlankHtml(content.privacy[c].body),
    ),
    service: LANGS.map((l) => l.code).filter(
      (c) => !content.service[c].title.trim() || isBlankHtml(content.service[c].body),
    ),
    popup: LANGS.map((l) => l.code).filter(
      (c) => !content.popup.langs[c].title.trim() || !content.popup.langs[c].body.trim(),
    ),
  };
  for (const tab of ['privacy', 'service', 'popup'] as const) {
    const list = missing[tab];
    if (list.length) {
      const labels = list.map((c) => LANGS.find((l) => l.code === c)?.label).join('、');
      return { tab, lang: list[0], message: `「${tabLabel(tab)}」还有未填全的语言：${labels}` };
    }
  }

  // 3. 弹窗正文不能有未替换的占位符（多个语言命中时取最后一个，同原型）
  let hit: LangCode | undefined;
  LANGS.forEach(({ code }) => {
    if (/\{\{[^}]*\}\}/.test(content.popup.langs[code].body.split(PHONE_TOKEN).join('')))
      hit = code;
  });
  if (hit) {
    const label = LANGS.find((l) => l.code === hit)?.label;
    return { tab: 'popup', lang: hit, message: `弹窗正文存在未替换的占位符（${label}）` };
  }
  return null;
}
