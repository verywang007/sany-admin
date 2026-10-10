import { useEffect, useState } from 'react';
import { Input, Modal, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { fetchCountryLov } from '@/services/customer/customerAnalysis';

interface Props {
  value?: string;
  onChange?: (v: string | undefined) => void;
}

type Row = { id: string; name: string };

/**
 * 国家 LOV（推断：原型 LOV 弹窗未捕获）。
 * 文本框右侧放大镜打开弹窗，弹窗内可搜索，点击行即选中并关闭。
 */
export default function CountryLov({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [list, setList] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchCountryLov(keyword)
      .then(setList)
      .finally(() => setLoading(false));
  }, [open, keyword]);

  return (
    <>
      <Input
        allowClear
        value={value ?? ''}
        onChange={(e) => {
          // 清空即清除选中；输入文字则带着关键字打开 LOV
          if (!e.target.value) {
            onChange?.(undefined);
            return;
          }
          setKeyword(e.target.value.replace(value ?? '', ''));
          setOpen(true);
        }}
        suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={() => setOpen(true)} />}
      />
      <Modal
        open={open}
        title="国家"
        width={520}
        footer={null}
        onCancel={() => {
          setOpen(false);
          setKeyword('');
        }}
        destroyOnHidden
      >
        <Input.Search
          allowClear
          placeholder="请输入国家名称"
          defaultValue={keyword}
          style={{ margin: '12px 0' }}
          onSearch={setKeyword}
        />
        <Table<Row>
          rowKey="id"
          size="small"
          bordered
          loading={loading}
          dataSource={list}
          columns={[{ title: '国家', dataIndex: 'name' }]}
          pagination={{ pageSize: 10, showSizeChanger: false, size: 'small' }}
          onRow={(r) => ({
            style: { cursor: 'pointer' },
            onClick: () => {
              onChange?.(r.name);
              setOpen(false);
              setKeyword('');
            },
          })}
        />
      </Modal>
    </>
  );
}
