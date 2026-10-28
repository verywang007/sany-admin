import { useEffect, useState } from 'react';
import { App, Button, Checkbox, Modal } from 'antd';
import { BellFilled } from '@ant-design/icons';
import type { Announcement } from '@/services/general-config/announcement';
import { getSystemLang, type LangCode } from '@/components/LangTabs/langs';
import { isBlankHtml } from '@/utils/html';
import styles from './NoticeModal.module.css';

/** 弹窗固定文案，随系统语言切换 */
const UI_TEXT: Record<
  LangCode,
  { head: string; ok: string; confirm: string; missing: string }
> = {
  'zh-CN': {
    head: '系统通知',
    ok: '我已知晓',
    confirm: '我已知晓：已阅读并知晓本公告内容',
    missing: '当前语言暂缺译文，以下为简体中文版',
  },
  'en-US': {
    head: 'System Notice',
    ok: 'Got it',
    confirm: 'I have read and understood this notice',
    missing: 'Translation unavailable for your language. Showing the Simplified Chinese version.',
  },
  'id-ID': {
    head: 'Pemberitahuan Sistem',
    ok: 'Saya Mengerti',
    confirm: 'Saya telah membaca dan memahami pengumuman ini',
    missing: 'Terjemahan belum tersedia. Menampilkan versi Bahasa Tionghoa Sederhana.',
  },
  'zh-TW': {
    head: '系統通知',
    ok: '我已知曉',
    confirm: '我已知曉：已閱讀並知曉本公告內容',
    missing: '目前語言暫缺譯文，以下為簡體中文版',
  },
};

interface Props {
  /** 要预览的公告；为空时关闭 */
  notice?: Announcement;
  onClose: () => void;
}

/**
 * 系统通知弹窗（模拟用户登录后看到的效果）。
 * 原型缺陷修正：
 * 1. 原型内容写死为内网切换公告，这里展示传入公告的标题与正文；
 * 2. 关闭（右上角 ×）始终可用，不与「强制阅读」勾选框关联，关闭后系统可正常使用，且不计入阅读统计；
 *    底部「我已知晓」为「已读」动作：在「强制阅读」公告下须先勾选确认框方可点击，点击后记为已阅读（原型演示，仅本页生效）。
 * 需求变更：弹窗语言按系统语言自动切换（PRD §5.4 R5 / §8 E7）——
 * 标题、正文取系统语言版本；该语言正文为空时回退简体中文并提示缺译文；
 * 系统语言无法匹配时按简体中文展示。固定文案同样随系统语言切换，
 * 自定义确认项文案只有简体中文一份，其他语言使用默认确认文案。
 */
export default function NoticeModal({ notice, onClose }: Props) {
  const { message } = App.useApp();
  const [checked, setChecked] = useState(false);
  const force = !!notice?.force;
  const sysLang = getSystemLang() ?? 'zh-CN';
  const ui = UI_TEXT[sysLang];
  const missing = !!notice && isBlankHtml(notice.content[sysLang]);
  const contentLang: LangCode = missing ? 'zh-CN' : sysLang;
  const confirmText = (sysLang === 'zh-CN' && notice?.confirmText) || ui.confirm;

  useEffect(() => {
    if (notice) setChecked(false);
  }, [notice]);

  const time = notice && (notice.eff === '立即生效' ? notice.publishTime : notice.eff);

  return (
    <Modal
      open={!!notice}
      width={480}
      centered
      maskClosable={false}
      keyboard={false}
      title={
        <div className={styles.head}>
          <span className={styles.icon}>
            <BellFilled />
          </span>
          <span className={styles.headTitle}>{ui.head}</span>
          <span className={styles.time}>{time}</span>
        </div>
      }
      onCancel={() => onClose()}
      footer={
        <div className={styles.footer}>
          {force && (
            <div className={styles.confirm}>
              <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
                {confirmText}
              </Checkbox>
            </div>
          )}
          <Button
            type="primary"
            block
            className={styles.ok}
            disabled={force && !checked}
            onClick={() => {
              onClose();
              message.success('已记录本次阅读（原型演示，仅本页生效）');
            }}
          >
            {ui.ok}
          </Button>
        </div>
      }
    >
      {notice && (
        <div className={styles.body}>
          {missing && sysLang !== 'zh-CN' && <div className={styles.missing}>{ui.missing}</div>}
          <div className={styles.title}>{notice.title[contentLang]}</div>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: notice.content[contentLang] }}
          />
        </div>
      )}
    </Modal>
  );
}
