import { useEffect, useState } from 'react';
import { App, Button, Checkbox, Modal } from 'antd';
import { BellFilled } from '@ant-design/icons';
import type { Announcement } from '@/services/general-config/announcement';
import styles from './NoticeModal.module.css';

interface Props {
  /** 要预览的公告；为空时关闭 */
  notice?: Announcement;
  onClose: () => void;
}

/**
 * 系统通知弹窗（模拟用户登录后看到的效果）。
 * 原型缺陷修正：
 * 1. 原型内容写死为内网切换公告，这里展示传入公告的标题与简体中文正文；
 * 2. 原型无论是否强制阅读都要求勾选后才能关闭，这里仅「强制阅读」时才需勾选确认。
 */
export default function NoticeModal({ notice, onClose }: Props) {
  const { message } = App.useApp();
  const [checked, setChecked] = useState(false);
  const force = !!notice?.force;

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
          <span className={styles.headTitle}>系统通知</span>
          <span className={styles.time}>{time}</span>
        </div>
      }
      onCancel={() => {
        if (force && !checked) {
          message.warning('请先勾选「我已知晓」，再关闭通知');
          return;
        }
        onClose();
      }}
      footer={
        <div className={styles.footer}>
          {force && (
            <div className={styles.confirm}>
              <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
                {notice?.confirmText ?? '我已知晓：已阅读并知晓本公告内容'}
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
            我已知晓
          </Button>
        </div>
      }
    >
      {notice && (
        <div className={styles.body}>
          <div className={styles.title}>{notice.title}</div>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: notice.content['zh-CN'] }}
          />
        </div>
      )}
    </Modal>
  );
}
