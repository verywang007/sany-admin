import dayjs from 'dayjs';
import { Input } from 'antd';
import { LANGS, type LangCode } from '@/components/LangTabs/langs';
import type { AgreementDoc, DocKind } from '@/services/general-config/agreement';
import { DOC_PLACEHOLDERS } from '../constants';
import { Field } from '@/components/EditForm';
import RichEditor from '@/components/RichEditor';
import styles from '@/components/EditForm/index.module.css';

interface Props {
  kind: DocKind;
  lang: LangCode;
  docs: Record<LangCode, AgreementDoc>;
  readOnly: boolean;
  onChange: (docs: Record<LangCode, AgreementDoc>) => void;
}

/** 隐私政策 / 用户服务协议某一语言的编辑面板 */
export default function DocPanel({ kind, lang, docs, readOnly, onChange }: Props) {
  const doc = docs[lang];
  const patch = (p: Partial<AgreementDoc>) => onChange({ ...docs, [lang]: { ...doc, ...p } });

  // 版本号与语言无关：任一语言修改时同步到同一 Tab 的所有语言
  const setVersion = (version: string) =>
    onChange(
      Object.fromEntries(LANGS.map(({ code }) => [code, { ...docs[code], version }])) as Record<
        LangCode,
        AgreementDoc
      >,
    );

  return (
    <>
      <div className={styles.grid}>
        <Field label="文档标题" required full>
          <Input
            value={doc.title}
            disabled={readOnly}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </Field>
        <Field label="版本号" required>
          <Input
            value={doc.version}
            disabled={readOnly}
            onChange={(e) => setVersion(e.target.value)}
          />
        </Field>
      </div>
      <RichEditor
        value={doc.body}
        readOnly={readOnly}
        placeholder={DOC_PLACEHOLDERS[kind][lang]}
        onChange={(body) => patch({ body, editedAt: dayjs().format('YYYY-MM-DD HH:mm') })}
        footerExtra={` · 最后编辑 ${doc.editedAt || '—'}`}
      />
    </>
  );
}
