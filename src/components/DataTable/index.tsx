import { Table, type TableProps } from 'antd';
import styles from './index.module.css';

export type DataTableProps<T> = TableProps<T> & {
  /** 左侧显示序号列 */
  showIndex?: boolean;
};

/**
 * 表格统一封装：带边框、紧凑行高、横向滚动、统一分页文案。
 * 分页对象由 useTableQuery 提供，这里只补默认展示项。
 * 约定：每行数据都带唯一的 id 字段（mock 数据统一补齐）。
 */
export default function DataTable<T extends object>({
  showIndex,
  columns = [],
  pagination,
  scroll,
  ...rest
}: DataTableProps<T>) {
  const current = pagination ? (pagination.current ?? 1) : 1;
  const size = pagination ? (pagination.pageSize ?? 20) : 20;

  const merged: TableProps<T>['columns'] = showIndex
    ? [
        {
          title: '',
          key: '__index',
          width: 56,
          align: 'center',
          fixed: 'left',
          render: (_v, _r, i) => (current - 1) * size + i + 1,
        },
        ...columns,
      ]
    : columns;

  return (
    <Table<T>
      className={styles.table}
      bordered
      size="small"
      rowKey="id"
      columns={merged}
      scroll={{ x: 'max-content', ...scroll }}
      pagination={
        pagination === false
          ? false
          : {
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50, 100],
              showTotal: (total, [from, to]) => `${from} - ${to} / ${total}`,
              ...pagination,
            }
      }
      {...rest}
    />
  );
}
