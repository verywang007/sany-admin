import { Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import StatusTag from '@/components/StatusTag';
import { ACCOUNT_CANCEL_SOURCE, ACCOUNT_CANCEL_STATUS } from '@/constants/accountCancel';
import type { CancelAction, CancelApply } from '@/services/customer/cancelApply';
import { colors } from '@/theme';
import { EMPTY } from './constants';
import styles from './index.module.css';

export function getColumns(
  onDetail: (row: CancelApply) => void,
  onAction: (row: CancelApply, action: CancelAction) => void,
): TableColumnsType<CancelApply> {
  return [
    {
      title: '申请单号',
      dataIndex: 'no',
      width: 160,
      ellipsis: true,
      render: (v: string, r) => <Typography.Link onClick={() => onDetail(r)}>{v}</Typography.Link>,
    },
    {
      title: '用户信息',
      key: 'userInfo',
      width: 150,
      ellipsis: true,
      render: (_, r) => (
        <div className={styles.userCell}>
          <strong>{r.user}</strong>
          <span>ID：{r.userId}</span>
        </div>
      ),
    },
    { title: '联系电话', dataIndex: 'phone', width: 130, ellipsis: true },
    { title: '邮箱', dataIndex: 'email', width: 240, ellipsis: true, render: (v: string) => v || EMPTY },
    { title: '用户名', dataIndex: 'login', width: 160, ellipsis: true, render: (v: string) => v || EMPTY },
    {
      title: '注销来源',
      dataIndex: 'source',
      width: 170,
      // 后管代客：第二行显示申请渠道和客服工单号（完整申请记录见详情）
      render: (v: string, r) => (
        <div className={styles.userCell}>
          <strong>{ACCOUNT_CANCEL_SOURCE[v]?.text || EMPTY}</strong>
          {v === 'MANUAL' && <span>{[r.channel, r.ticketNo].filter(Boolean).join(' · ') || EMPTY}</span>}
        </div>
      ),
    },
    { title: '注销原因', dataIndex: 'reason', width: 220, ellipsis: true, render: (v: string) => v || EMPTY },
    {
      title: '用户类型',
      dataIndex: 'userType',
      width: 132,
      ellipsis: true,
      render: (v: string) => v || EMPTY,
    },
    { title: '国家', dataIndex: 'country', width: 90, ellipsis: true },
    {
      title: '注销状态',
      dataIndex: 'status',
      width: 100,
      render: (v: string) => <StatusTag lookup={ACCOUNT_CANCEL_STATUS} value={v} />,
    },
    { title: '申请时间', dataIndex: 'apply', width: 140, ellipsis: true },
    {
      title: '冷静期截止时间',
      dataIndex: 'cool',
      width: 150,
      // 原型：仅冷静期内的截止日期标橙红（方案建议“距今不足 3 天标红”，此处沿用原型）
      render: (v: string, r) =>
        v ? (
          <span style={r.status === 'COOLING' ? { color: colors.error } : undefined}>{v}</span>
        ) : (
          EMPTY
        ),
    },
    { title: '完成时间', dataIndex: 'finish', width: 140, render: (v: string) => v || EMPTY },
    { title: '操作人', dataIndex: 'operator', width: 160, ellipsis: true, render: (v: string) => v || EMPTY },
    {
      title: '操作', key: 'action', width: 120, fixed: 'right',
      render: (_, row) => row.source === 'MANUAL' && row.status === 'COOLING'
        ? <Typography.Link onClick={() => onAction(row, 'revoke')}>撤销注销</Typography.Link>
        : EMPTY,
    },
  ];
}
