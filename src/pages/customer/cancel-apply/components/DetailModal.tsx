import { Alert, Button, Descriptions, Modal, Tabs, Timeline } from 'antd';
import StatusTag from '@/components/StatusTag';
import { ACCOUNT_CANCEL_SOURCE, ACCOUNT_CANCEL_STATUS } from '@/constants/accountCancel';
import type { CancelApply } from '@/services/customer/cancelApply';
import { colors } from '@/theme';
import { cssVars, EMPTY } from '../constants';
import styles from '../index.module.css';

interface Props {
  row?: CancelApply;
  onClose: () => void;
}

// 「校验结果」Tab：原型为写死内容，与所选行无关（方案 §7.3 要求按申请动态展示，待接口提供明细）
const CHECKS: { level: 'pass' | 'soft' | 'block'; label: string; detail: string }[] = [
  { level: 'pass', label: '校验通过', detail: '账号当前无锁定记录，未发现进行中的注销流程' },
  { level: 'soft', label: '积分', detail: '账户仍有 120 积分，注销后将清零' },
  { level: 'soft', label: '已关联企业子账户', detail: '已关联 1 个企业子账户，注销后将解除关联' },
  { level: 'soft', label: '已关联设备', detail: '已关联 3 台设备，注销后将解除设备关系' },
  { level: 'soft', label: '已产生维护记录', detail: '已产生 6 条维护记录，将匿名化后保留' },
];

const LEVEL_COLOR = { pass: colors.success, soft: colors.warning, block: colors.error };

const sourceText = (r: CancelApply) => ACCOUNT_CANCEL_SOURCE[r.source]?.text ?? r.source;

function timelineItems(items: { title: string; time: string; desc: string; done?: boolean }[]) {
  return items.map((it) => ({
    color: it.done ? colors.primary : 'gray',
    children: (
      <>
        <div>
          {it.title}
          <span className={styles.attachSize}>{it.time}</span>
        </div>
        <div className={styles.cardNote}>{it.desc}</div>
      </>
    ),
  }));
}

export default function DetailModal({ row, onClose }: Props) {
  const r = row;

  return (
    <Modal
      open={!!row}
      title={r ? `注销申请详情 · ${r.no}` : '注销申请详情'}
      width={930}
      onCancel={onClose}
      // 关闭后销毁，下次打开总是回到第 1 个 Tab
      destroyOnHidden
      styles={{ body: { ...cssVars, maxHeight: '70vh', overflowY: 'auto' } }}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
      ]}
    >
      {r && (
        <Tabs
          items={[
            {
              key: 'info',
              label: '申请信息',
              children: (
                <>
                  <Alert
                    type="warning"
                    showIcon={false}
                    style={{ marginBottom: 12 }}
                    message="注销执行后将自动完成解绑、锁定和个人信息匿名化处理，冷静期结束后不可恢复。当前申请来源和用户快照仅用于合规回溯。"
                  />
                  <Descriptions
                    bordered
                    size="small"
                    column={3}
                    items={[
                      { label: '申请单号', children: r.no },
                      { label: '用户ID', children: r.userId },
                      {
                        label: '当前状态',
                        children: <StatusTag lookup={ACCOUNT_CANCEL_STATUS} value={r.status} />,
                      },
                      { label: '昵称', children: r.user },
                      { label: '登录用户名', children: r.login },
                      { label: '联系电话', children: r.phone },
                      { label: '国家/地区', children: r.country },
                      { label: '申请来源', children: sourceText(r) },
                      { label: '申请时间', children: r.apply },
                    ]}
                  />
                  <div className={styles.section}>注销原因</div>
                  <div className={styles.reason}>
                    {r.reason === '其他'
                      ? '用户提出账户注销申请，具体原因详见客服工单。'
                      : `${r.reason}，希望注销账户并删除个人信息。`}
                  </div>
                  <div className={styles.section}>申请记录</div>
                  {r.source === 'MANUAL' ? (
                    <Descriptions
                      bordered
                      size="small"
                      column={2}
                      items={[
                        { label: '申请渠道', children: r.channel || EMPTY },
                        { label: '客服工单号', children: r.ticketNo || EMPTY },
                        { label: '操作人', children: r.operator || EMPTY },
                        { label: '验证码验证时间', children: r.verifiedAt || EMPTY },
                        { label: '客户确认', span: 2, children: '已向客户说明注销影响及 15 天冷静期，客户本人确认申请注销' },
                      ]}
                    />
                  ) : (
                    <div className={styles.reason}>客户在 APP 内本人提交，已通过绑定手机短信验证码验证身份。</div>
                  )}
                </>
              ),
            },
            {
              key: 'check',
              label: '校验结果',
              children: (
                <>
                  <div className={styles.section} style={{ marginTop: 0 }}>
                    前置校验结果
                  </div>
                  <div className={styles.checkList}>
                    {CHECKS.map((c) => (
                      <div key={c.label} className={styles.checkItem}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: LEVEL_COLOR[c.level],
                          }}
                        />
                        <span className={styles.checkLabel}>{c.label}</span>
                        <span>{c.detail}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.section}>处理建议</div>
                  <div className={styles.reason}>
                    注销无平台审核和硬拦截，以上为告知项。申请提交后直接进入 15
                    天冷静期，冷静期内客户可在 APP 撤销；后管代客的申请也可由管理员撤销。
                  </div>
                </>
              ),
            },
            {
              key: 'progress',
              label: '执行进度',
              children: (
                <>
                  <div className={styles.section} style={{ marginTop: 0, marginBottom: 16 }}>
                    注销执行进度
                  </div>
                  {/* 原型为写死时间轴；首个节点的时间和来源改为取当前申请 */}
                  <Timeline
                    items={timelineItems([
                      {
                        title: '提交注销申请',
                        time: r.apply,
                        desc: `申请来源：${sourceText(r)} · 系统校验完成`,
                        done: true,
                      },
                      {
                        title: '进入冷静期',
                        time: r.cool ? `截止 ${r.cool}` : '—',
                        desc: '冷静期默认 15 天，期间用户可主动撤销申请',
                        done: r.status === 'COOLING' || r.status === 'CANCELLED',
                      },
                      {
                        title: '注销任务执行',
                        time: '待触发',
                        desc: '账号匿名化、认证信息删除、资产清零、绑定解除',
                      },
                      {
                        title: '注销完成',
                        time: '待完成',
                        desc: '保留审计与隐私授权记录，停止账号登录',
                      },
                    ])}
                  />
                </>
              ),
            },
            {
              key: 'log',
              label: '操作日志',
              children: (
                <>
                  <div className={styles.section} style={{ marginTop: 0, marginBottom: 16 }}>
                    操作日志
                  </div>
                  <Timeline
                    items={timelineItems([
                      ...(r.source === 'MANUAL'
                        ? [
                            {
                              title: '客户短信验证码验证通过',
                              time: r.verifiedAt || r.apply,
                              desc: '验证码发送至客户已绑定手机',
                              done: true,
                            },
                            {
                              title: '客服代客提交注销申请',
                              time: r.apply,
                              desc: `渠道：${r.channel || EMPTY} · 工单：${r.ticketNo || EMPTY} · 操作人：${r.operator || EMPTY}`,
                              done: true,
                            },
                            {
                              title: '已短信通知客户',
                              time: r.apply,
                              desc: '告知冷静期截止时间及 APP 撤销方式',
                              done: true,
                            },
                          ]
                        : [
                            {
                              title: '用户提交注销申请',
                              time: r.apply,
                              desc: `来源：${sourceText(r)} · IP：103.28.45.16`,
                              done: true,
                            },
                          ]),
                      {
                        title: '系统完成前置校验',
                        time: r.apply,
                        desc: `软提醒 4 条（仅告知，不拦截）`,
                        done: true,
                      },
                      ...(r.status === 'REVOKED'
                        ? [
                            {
                              title: '注销申请已撤销',
                              time: EMPTY,
                              desc: `操作人：${r.operator || '客户本人（APP）'}${r.remark ? ' · 备注：' + r.remark : ''}`,
                              done: true,
                            },
                          ]
                        : []),
                    ])}
                  />
                </>
              ),
            },
          ]}
        />
      )}
    </Modal>
  );
}
