import { useCallback, useEffect, useMemo, useState } from 'react';
import { App, Button, Typography } from 'antd';
import PageContainer, { PageCard } from '@/components/PageContainer';
import SearchForm, { type SearchField } from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import { useTableQuery } from '@/utils/useTableQuery';
import {
  cancelAnnouncement,
  deleteAnnouncement,
  fetchAnnouncementList,
  getLoginNotice,
  TOUCH_SYS,
  type Announcement,
} from '@/services/general-config/announcement';
import { createColumns, type RowAction } from './columns';
import { STATUS_OPTIONS, TYPE_OPTIONS } from './constants';
import EditView, { type EditTarget } from './components/EditView';
import CancelReasonModal from '@/components/CancelReasonModal';
import NoticeModal from './components/NoticeModal';
import styles from './index.module.css';

const fields: SearchField[] = [
  { type: 'input', name: 'title', label: '公告标题', placeholder: '请输入公告标题' },
  {
    type: 'select',
    name: 'type',
    label: '公告类型',
    options: TYPE_OPTIONS,
    placeholder: '全部类型',
  },
  {
    type: 'select',
    name: 'status',
    label: '公告状态',
    options: STATUS_OPTIONS,
    placeholder: '全部状态',
  },
  // 原型缺陷：发布时间为纯文本框且不参与过滤，这里改为日期范围筛选
  {
    type: 'dateRange',
    name: 'publishTime',
    label: '发布时间',
    placeholder: ['开始日期', '结束日期'],
  },
];

/** 模拟「登录后弹出系统通知」：每个会话只弹一次（原型每次打开页面都会弹） */
let loginNoticeShown = false;

/** 通用配置 · 公告：列表视图 + 编辑视图（新建 / 编辑 / 详情 / 基于此公告新建）+ 系统通知预览 */
export default function AnnouncementPage() {
  const { message, modal } = App.useApp();
  const { tableProps, total, search, reset, reload } = useTableQuery(fetchAnnouncementList);
  const [editing, setEditing] = useState<EditTarget>();
  const [cancelRow, setCancelRow] = useState<Announcement>();
  const [notice, setNotice] = useState<Announcement>();

  useEffect(() => {
    if (loginNoticeShown) return;
    const timer = setTimeout(() => {
      // 在回调里置位，避免 StrictMode 下 effect 重复执行导致不弹出
      loginNoticeShown = true;
      getLoginNotice().then(setNotice);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  /** 发布后的提示；立即发布且触达方式含系统通知时，600ms 后弹出该公告的系统通知 */
  const afterPublish = useCallback(
    (row: Announcement) => {
      if (row.status === 'SCHEDULED') {
        message.success(`已提交发布，${row.eff} 生效`);
      } else if (row.status === 'PUBLISHED') {
        if (row.touches.includes(TOUCH_SYS)) {
          message.success('公告已发布，用户登录后将弹出系统通知');
          setTimeout(() => setNotice(row), 600);
        } else {
          message.success('公告已发布');
        }
      }
    },
    [message],
  );

  const columns = useMemo(
    () =>
      createColumns((act: RowAction, row) => {
        switch (act) {
          case 'view':
          case 'edit':
            return setEditing({ mode: act, id: row.id });
          case 'copy':
            message.success(`已复制 ${row.no} 的全部内容为新草稿`);
            return setEditing({ mode: 'copy', id: row.id });
          case 'cancel':
            return setCancelRow(row);
          case 'delete':
            return modal.confirm({
              title: '删除确认',
              width: 460,
              content: (
                <>
                  <div>确定删除草稿 {row.no}？删除后不可恢复。</div>
                  <div className={styles.warn}>
                    仅「草稿」状态可删除。已发布 / 已失效的公告永久留存供举证，不提供删除。
                  </div>
                </>
              ),
              okText: '确定删除',
              okButtonProps: { danger: true },
              onOk: async () => {
                await deleteAnnouncement(row.id);
                message.success(`已删除草稿 ${row.no}`);
                reload();
              },
            });
        }
      }),
    [afterPublish, message, modal, reload],
  );

  return (
    <PageContainer
      title={
        <>
          公告
          <span className={styles.crumb}>/ 通用配置</span>
        </>
      }
      extra={
        !editing && (
          <Button type="primary" onClick={() => setEditing({ mode: 'new' })}>
            ＋ 新建公告
          </Button>
        )
      }
      card={false}
    >
      {/* 列表保持挂载，返回时保留查询条件与分页 */}
      <div hidden={!!editing} className={styles.list}>
        <PageCard>
          <SearchForm
            fields={fields}
            labelWidth={82}
            onSearch={search}
            onReset={() => {
              reset();
              message.success('筛选条件已重置');
            }}
          />
        </PageCard>
        <PageCard
          title={
            <>
              公告列表
              <Typography.Text type="secondary" className={styles.count}>
                共 {total} 条记录
              </Typography.Text>
            </>
          }
        >
          <DataTable
            {...tableProps}
            columns={columns}
            locale={{ emptyText: '暂无符合条件的公告' }}
          />
        </PageCard>
      </div>
      {editing && (
        <PageCard>
          <EditView
            key={`${editing.mode}-${editing.id ?? ''}`}
            target={editing}
            onBack={() => setEditing(undefined)}
            onSaved={(row) => {
              afterPublish(row);
              reload();
            }}
          />
        </PageCard>
      )}
      <CancelReasonModal
        subject="公告"
        open={!!cancelRow}
        onCancel={() => setCancelRow(undefined)}
        onOk={async (reason) => {
          await cancelAnnouncement(cancelRow!.id, reason);
          message.success('已取消发布，退回草稿状态');
          setCancelRow(undefined);
          reload();
        }}
      />
      <NoticeModal notice={notice} onClose={() => setNotice(undefined)} />
    </PageContainer>
  );
}
