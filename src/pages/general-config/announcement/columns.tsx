import { Space, Tag, Typography } from 'antd';
import TypeTag from './components/TypeTag';
import type { TableColumnsType } from 'antd';
import StatusTag from '@/components/StatusTag';
import { colors } from '@/theme';
import {
  confirmRateText,
  titleOf,
  type Announcement,
} from '@/services/general-config/announcement';
import { ANNOUNCEMENT_STATUS } from './constants';

export type RowAction = 'view' | 'edit' | 'publish' | 'delete' | 'cancel' | 'copy';

const ACTIONS: Record<
  Announcement['status'],
  { key: RowAction; text: string; danger?: boolean }[]
> = {
  DRAFT: [
    { key: 'edit', text: '编辑' },
    { key: 'publish', text: '发布' },
    { key: 'delete', text: '删除', danger: true },
  ],
  SCHEDULED: [
    { key: 'view', text: '查看' },
    { key: 'cancel', text: '取消发布' },
  ],
  PUBLISHED: [
    { key: 'view', text: '查看' },
    { key: 'copy', text: '基于此公告新建' },
  ],
  EXPIRED: [
    { key: 'view', text: '查看' },
    { key: 'copy', text: '基于此公告新建' },
  ],
};

export function createColumns(
  onAction: (act: RowAction, row: Announcement) => void,
): TableColumnsType<Announcement> {
  return [
    {
      title: '公告编号',
      dataIndex: 'no',
      width: 130,
      ellipsis: true,
      render: (v: string, r) => (
        <Typography.Link onClick={() => onAction('view', r)}>{v}</Typography.Link>
      ),
    },
    {
      title: '公告标题',
      key: 'title',
      width: 310,
      ellipsis: true,
      // 标题按语言维护，列表展示简体中文版
      render: (_, r) => titleOf(r),
    },
    {
      title: '公告类型',
      dataIndex: 'type',
      width: 96,
      render: (v: string) => <TypeTag value={v} />,
    },
    {
      title: '触达方式',
      dataIndex: 'touches',
      width: 200,
      ellipsis: true,
      render: (list: string[]) =>
        list.map((t) => (
          <Tag
            key={t}
            style={{
              color: colors.primary,
              borderColor: colors.primary,
              background: 'rgba(41,190,206,.06)',
              marginInlineEnd: 4,
            }}
          >
            {t}
          </Tag>
        )),
    },
    { title: '生效时间', dataIndex: 'eff', width: 145 },
    { title: '失效时间', dataIndex: 'exp', width: 145 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 84,
      render: (v: string) => <StatusTag variant="dot" lookup={ANNOUNCEMENT_STATUS} value={v} />,
    },
    { title: '发布人', dataIndex: 'publisher', width: 110, ellipsis: true },
    // 需求变更：阅读率改为确认率
    { title: '确认率', key: 'confirmRate', width: 64, render: (_, r) => confirmRateText(r) },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, r) => (
        <Space size={10} style={{ whiteSpace: 'nowrap' }}>
          {ACTIONS[r.status].map((a) => (
            <Typography.Link
              key={a.key}
              type={a.danger ? 'danger' : undefined}
              onClick={() => onAction(a.key, r)}
            >
              {a.text}
            </Typography.Link>
          ))}
        </Space>
      ),
    },
  ];
}
