import { Space, Tooltip, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import StatusTag from '@/components/StatusTag';
import type { AgreementRelease } from '@/services/general-config/agreement';
import { AGREEMENT_STATUS } from './constants';

export type RowAction = 'view' | 'edit' | 'delete' | 'cancel' | 'copy' | 'agree';

const ACTIONS: Record<
  AgreementRelease['status'],
  { key: RowAction; text: string; danger?: boolean }[]
> = {
  DRAFT: [
    { key: 'edit', text: '编辑' },
    { key: 'delete', text: '删除', danger: true },
  ],
  SCHEDULED: [
    { key: 'view', text: '查看' },
    { key: 'cancel', text: '取消发布' },
  ],
  PUBLISHED: [
    { key: 'view', text: '查看' },
    { key: 'copy', text: '基于此版本新建' },
  ],
  EXPIRED: [
    { key: 'view', text: '查看' },
    { key: 'copy', text: '基于此版本新建' },
  ],
};

const num = (n: number) => (n ? n.toLocaleString('en-US') : '-');

/** 列宽按方案文档（原型 colgroup 漏写状态列导致宽度错位） */
export function createColumns(
  onAction: (act: RowAction, row: AgreementRelease) => void,
): TableColumnsType<AgreementRelease> {
  return [
    {
      title: '发布编号',
      dataIndex: 'version',
      width: 100,
      render: (v: string, r) => (
        <Typography.Link strong onClick={() => onAction('view', r)}>
          {v}
        </Typography.Link>
      ),
    },
    {
      title: '适用站点',
      dataIndex: 'sites',
      width: 150,
      render: (sites: string[]) =>
        sites.length > 1 ? (
          <>
            {sites[0]}
            <Tooltip title={sites.join('、')}>
              <Typography.Link style={{ fontSize: 12, marginLeft: 2 }}>
                等{sites.length}个
              </Typography.Link>
            </Tooltip>
          </>
        ) : (
          sites[0]
        ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (v: string) => <StatusTag variant="dot" lookup={AGREEMENT_STATUS} value={v} />,
    },
    { title: '生效时间', dataIndex: 'effectiveTime', width: 140, render: (v: string) => v || '-' },
    { title: '失效时间', dataIndex: 'expireTime', width: 140, render: (v: string) => v || '-' },
    {
      title: '触达人数',
      dataIndex: 'totalUser',
      width: 90,
      align: 'right',
      render: (v: number) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{num(v)}</span>,
    },
    {
      title: '同意人数',
      dataIndex: 'agreeUser',
      width: 100,
      align: 'right',
      render: (v: number, r) =>
        v ? (
          <Typography.Link
            strong
            style={{ fontVariantNumeric: 'tabular-nums' }}
            onClick={() => onAction('agree', r)}
          >
            {num(v)}
          </Typography.Link>
        ) : (
          '-'
        ),
    },
    { title: '发布人', dataIndex: 'publisher', width: 80 },
    {
      title: '操作',
      key: 'action',
      width: 240,
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
