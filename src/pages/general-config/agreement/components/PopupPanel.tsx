import { Input } from 'antd';
import LangTabs, { type LangCode } from '@/components/LangTabs';
import type { AgreementContent, PopupLang } from '@/services/general-config/agreement';
import { PHONE_TOKEN, POPUP_PLACEHOLDERS } from '../constants';
import { Field } from '@/components/EditForm';
import styles from '@/components/EditForm/index.module.css';

interface Props {
  lang: LangCode;
  onLangChange: (lang: LangCode) => void;
  popup: AgreementContent['popup'];
  readOnly: boolean;
  onChange: (popup: AgreementContent['popup']) => void;
}

/** 「变更内容弹窗」Tab：公共客服电话 + 各语言弹窗标题 / 正文 */
export default function PopupPanel({ lang, onLangChange, popup, readOnly, onChange }: Props) {
  const item = popup.langs[lang];
  const patch = (p: Partial<PopupLang>) =>
    onChange({ ...popup, langs: { ...popup.langs, [lang]: { ...item, ...p } } });

  return (
    <>
      <div className={`${styles.grid} ${styles.single}`}>
        <Field
          label="客服电话"
          hint={
            <>
              所有语言共用同一客服电话；在弹窗正文中可用 <code>{PHONE_TOKEN}</code> 占位符引用
            </>
          }
        >
          <Input
            style={{ width: 240 }}
            value={popup.phone}
            disabled={readOnly}
            onChange={(e) => onChange({ ...popup, phone: e.target.value })}
          />
        </Field>
      </div>
      <LangTabs
        style={{ marginTop: 8 }}
        value={lang}
        onChange={onLangChange}
        hint="每个语言都必须填写标题与正文，缺失则不可发布"
      />
      <div className={`${styles.grid} ${styles.single} ${styles.popupPanel}`}>
        <Field label="弹窗标题" required>
          <Input
            value={item.title}
            disabled={readOnly}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </Field>
        <Field label="弹窗正文" required>
          <Input.TextArea
            rows={8}
            style={{ fontSize: 12, lineHeight: 1.7 }}
            value={item.body}
            disabled={readOnly}
            placeholder={POPUP_PLACEHOLDERS[lang]}
            onChange={(e) => patch({ body: e.target.value })}
          />
        </Field>
      </div>
    </>
  );
}
