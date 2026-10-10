import { Space, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import StatusTag from '@/components/StatusTag';
import { ACCOUNT_CANCEL_STATUS } from '@/constants/accountCancel';
import type { CancelAction, CancelApply } from '@/services/customer/cancelApply';
import { colors } from '@/theme';
import { ACTION_TEXT, ACTIONS_BY_STATUS, EMPTY } from './constants';
import styles from './index.module.css';

const ACTION_COLOR: Record<CancelAction, string> = {
  approve: colors.primary,
  reject: colors.error,
  retry: colors.warning,
  revoke: colors.error,
};

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
    {
      title: '用户类型',
      dataIndex: 'userType',
      width: 132,
      ellipsis: true,
      render: (v: string) => v || EMPTY,
    },
    { title: '国家/地区', dataIndex: 'country', width: 90, ellipsis: true },
    { title: '注销原因', dataIndex: 'reason', width: 105, ellipsis: true },
    {
      title: '校验结果',
      dataIndex: 'risk',
      width: 108,
      ellipsis: true,
      render: (v: string) => (
        <span style={{ color: v.includes('通过') ? colors.success : colors.warning }}>{v}</span>
      ),
    },
    {
      title: '注销状态',
      dataIndex: 'status',
      width: 100,
      render: (v: string) => <StatusTag lookup={ACCOUNT_CANCEL_STATUS} value={v} />,
    },
    { title: '申请时间', dataIndex: 'apply', width: 140, ellipsis: true },
    {
      title: '冷静期截止',
      dataIndex: 'cool',
      width: 108,
      // 原型：仅冷静期内的截止日期标橙红（方案建议“距今不足 3 天标红”，此处沿用原型）
      render: (v: string, r) =>
        v ? (
          <span style={r.status === 'COOLING' ? { color: colors.error } : undefined}>{v}</span>
        ) : (
          EMPTY
        ),
    },
    { title: '完成时间', dataIndex: 'finish', width: 140, render: (v: string) => v || EMPTY },
    {
      title: '操作',
      key: 'action',
      width: 170,
      render: (_, r) => (
        <Space size={12}>
          <Typography.Link onClick={() => onDetail(r)}>查看详情</Typography.Link>
          {(ACTIONS_BY_STATUS[r.status] ?? []).map((a) => (
            <Typography.Link
              key={a}
              style={{ color: ACTION_COLOR[a] }}
              onClick={() => onAction(r, a)}
            >
              {ACTION_TEXT[a]}
            </Typography.Link>
          ))}
        </Space>
      ),
    },
  ];
}
