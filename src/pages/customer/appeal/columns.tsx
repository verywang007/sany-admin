import { Button, Space, type TableColumnsType } from 'antd';
import type { Appeal } from '@/services/customer/appeal';
import { FEEDBACK } from './constants';
import { lookupText } from '@/utils/lookup';
import { EllipsisText, Thumbnails } from './components/Thumbnails';

interface Actions {
  onReply: (row: Appeal) => void;
  onViewRecords: (row: Appeal) => void;
}

const ellipsis = { showTitle: false } as const;
const renderEllipsis = (v: string) => <EllipsisText value={v} />;

/**
 * 操作按钮显示规则：
 * - 未回复：回复
 * - 已回复且用户未反馈“已解决”：回复、查看记录
 * - 已回复且已解决：查看记录
 * 原型按中文文案（"已回复"/"已解决"）判断，这里改为按编码判断。
 */
function renderActions(row: Appeal, { onReply, onViewRecords }: Actions) {
  const replied = row.replyState === '1';
  const canReply = !replied || row.feedback !== '1';
  return (
    <Space size={0}>
      {canReply && (
        <Button type="link" size="small" onClick={() => onReply(row)}>
          回复
        </Button>
      )}
      {replied && (
        <Button type="link" size="small" onClick={() => onViewRecords(row)}>
          查看记录
        </Button>
      )}
    </Space>
  );
}

export const buildColumns = (actions: Actions): TableColumnsType<Appeal> => [
  { title: '设备编码', dataIndex: 'deviceNo', width: 140 },
  { title: '设备名称', dataIndex: 'deviceName', width: 140 },
  { title: '提交时间', dataIndex: 'creationDate', width: 160 },
  { title: '登录账号', dataIndex: 'createdByName', width: 120 },
  { title: '错误类型', dataIndex: 'problemTypeName', width: 110 },
  {
    title: '设备经纬度',
    dataIndex: 'devicePosition',
    width: 200,
    ellipsis,
    render: renderEllipsis,
  },
  { title: '手机经纬度', dataIndex: 'phonePosition', width: 200, ellipsis, render: renderEllipsis },
  {
    title: '缩略图',
    dataIndex: 'problemImage',
    width: 400,
    render: (_v, r) => <Thumbnails list={r.problemImageList} />,
  },
  { title: '问题描述', dataIndex: 'problemDesc', width: 250, ellipsis, render: renderEllipsis },
  { title: '问题回复', dataIndex: 'problemReply', width: 250, ellipsis, render: renderEllipsis },
  {
    title: '用户反馈',
    dataIndex: 'feedback',
    width: 90,
    render: (v: string) => lookupText(FEEDBACK, v),
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    align: 'center',
    render: (_v, r) => renderActions(r, actions),
  },
];
