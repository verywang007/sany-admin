import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { App, Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageContainer from '@/components/PageContainer';
import SearchForm, { type SearchField } from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import { useTableQuery } from '@/utils/useTableQuery';
import {
  cancelAgreement,
  deleteAgreement,
  fetchAgreementList,
  type AgreementRelease,
} from '@/services/general-config/agreement';
import { createColumns, type RowAction } from './columns';
import { SITE_OPTIONS, STATUS_OPTIONS } from './constants';
import EditView, { type EditTarget } from './components/EditView';
import CancelReasonModal from '@/components/CancelReasonModal';

const fields: SearchField[] = [
  { type: 'input', name: 'version', label: '发布编号', placeholder: '请输入发布编号' },
  { type: 'select', name: 'site', label: '适用站点', options: SITE_OPTIONS, placeholder: '全部' },
  { type: 'select', name: 'status', label: '状态', options: STATUS_OPTIONS, placeholder: '全部' },
  {
    type: 'dateRange',
    name: 'effectiveTime',
    label: '生效时间',
    placeholder: ['开始日期', '结束日期'],
  },
  { type: 'input', name: 'publisher', label: '发布人', placeholder: '请输入发布人' },
];

/** 通用配置 · 隐私/服务协议管理：列表视图 + 编辑视图（新建 / 编辑 / 详情 / 基于此版本新建） */
export default function AgreementPage() {
  const { message, modal } = App.useApp();
  const navigate = useNavigate();
  const { tableProps, search, reset, reload } = useTableQuery(fetchAgreementList);
  const [editing, setEditing] = useState<EditTarget>();
  const [cancelRow, setCancelRow] = useState<AgreementRelease>();

  const columns = useMemo(
    () =>
      createColumns((act: RowAction, row) => {
        switch (act) {
          case 'view':
          case 'edit':
            return setEditing({ mode: act, id: row.id });
          case 'copy':
            message.success(`已复制 ${row.version} 的全部内容为新草稿`);
            return setEditing({ mode: 'copy', id: row.id });
          case 'cancel':
            return setCancelRow(row);
          case 'delete':
            return modal.confirm({
              title: '删除确认',
              width: 460,
              content: (
                <>
                  <div>确定删除草稿 {row.version}？删除后不可恢复。</div>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    仅「草稿」状态可删除。已发布 / 已失效的版本永久留存供举证，不提供删除。
                  </Typography.Text>
                </>
              ),
              okText: '确定删除',
              okButtonProps: { danger: true },
              onOk: async () => {
                await deleteAgreement(row.id);
                message.success('已删除');
                reload();
              },
            });
          case 'agree':
            // 原型仅提示；这里跳转隐私授权记录并带版本号筛选
            return navigate(`/customer/privacy-auth?version=${encodeURIComponent(row.version)}`);
        }
      }),
    [message, modal, navigate, reload],
  );

  return (
    <PageContainer
      title="隐私/服务协议管理"
      extra={
        !editing && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setEditing({ mode: 'new' })}
          >
            新建版本
          </Button>
        )
      }
    >
      {/* 列表保持挂载，返回时保留查询条件与分页 */}
      <div hidden={!!editing}>
        <SearchForm
          fields={fields}
          collapsedRows={2}
          labelWidth={80}
          onSearch={search}
          onReset={reset}
        />
        <DataTable {...tableProps} columns={columns} />
      </div>
      {editing && (
        <EditView
          key={`${editing.mode}-${editing.id ?? ''}`}
          target={editing}
          onBack={() => setEditing(undefined)}
          onSaved={reload}
          onSwitch={setEditing}
        />
      )}
      <CancelReasonModal
        subject="版本"
        open={!!cancelRow}
        onCancel={() => setCancelRow(undefined)}
        onOk={async (reason) => {
          await cancelAgreement(cancelRow!.id, reason);
          message.success('已取消发布，退回草稿');
          setCancelRow(undefined);
          reload();
        }}
      />
    </PageContainer>
  );
}
