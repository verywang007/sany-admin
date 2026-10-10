import { useEffect, useState } from 'react';
import { Modal, type TableColumnsType } from 'antd';
import DataTable from '@/components/DataTable';
import { fetchReplyRecords, type Appeal, type AppealReply } from '@/services/customer/appeal';
import { FEEDBACK } from '../constants';
import { lookupText } from '@/utils/lookup';
import { Thumbnails } from './Thumbnails';

const columns: TableColumnsType<AppealReply> = [
  { title: '回复时间', dataIndex: 'lastUpdateDate', width: 160 },
  { title: '回复人', dataIndex: 'replyName', width: 120 },
  { title: '回复内容', dataIndex: 'problemReply' },
  {
    title: '回复图片',
    dataIndex: 'problemReplyImage',
    width: 330,
    render: (_v, r) => <Thumbnails list={r.problemReplyImageList} />,
  },
  {
    title: '用户反馈',
    dataIndex: 'feedback',
    width: 90,
    render: (v: string) => lookupText(FEEDBACK, v),
  },
];

interface Props {
  record?: Appeal;
  onClose: () => void;
}

/** 回复记录：只读子表 */
export default function ReplyRecordsModal({ record, onClose }: Props) {
  const [data, setData] = useState<AppealReply[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!record) return;
    setData([]);
    setLoading(true);
    fetchReplyRecords(record.id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [record]);

  return (
    <Modal
      open={!!record}
      title="回复记录"
      width={850}
      footer={null}
      onCancel={onClose}
      destroyOnHidden
    >
      <DataTable<AppealReply>
        dataSource={data}
        loading={loading}
        columns={columns}
        pagination={false}
      />
    </Modal>
  );
}
