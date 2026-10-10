import { useMemo, useState } from 'react';
import { App, Button, Space } from 'antd';
import { CloudUploadOutlined, ExportOutlined, PlusSquareOutlined } from '@ant-design/icons';
import PageContainer from '@/components/PageContainer';
import SearchForm, { type SearchField } from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import ImportModal from '@/components/ImportModal';
import {
  deleteDeviceAdmin,
  fetchDeviceAdminList,
  importDeviceAdmin,
  type DeviceAdmin,
} from '@/services/customer/deviceAdmin';
import { useTableQuery } from '@/utils/useTableQuery';
import { usePrototypeActions } from '@/utils/feedback';
import { getColumns } from './columns';
import DeviceAdminModal from './components/DeviceAdminModal';

const fields: SearchField[] = [
  { type: 'input', name: 'crmCustomerName', label: '客户名称', placeholder: '请输入' },
  { type: 'input', name: 'crmCustomerNo', label: '客户编码', placeholder: '请输入' },
  { type: 'input', name: 'adminMysanyNo', label: '管理员MySany账号', placeholder: '请输入' },
];

/** 设备管理员配置 */
export default function DeviceAdminPage() {
  const { message, modal } = App.useApp();
  const { tableProps, search, reset, reload } = useTableQuery(fetchDeviceAdminList);
  const { exportData } = usePrototypeActions();
  const [editing, setEditing] = useState<{ open: boolean; record: DeviceAdmin | null }>({
    open: false,
    record: null,
  });
  const [importOpen, setImportOpen] = useState(false);

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: (record) => setEditing({ open: true, record }),
        onDelete: (record) =>
          modal.confirm({
            title: '确定删除此项吗？',
            onOk: async () => {
              await deleteDeviceAdmin(record.id);
              message.success('删除成功');
              reload();
            },
          }),
      }),
    [modal, message, reload],
  );

  return (
    <PageContainer title="设备管理员配置">
      <SearchForm fields={fields} columns={3} labelWidth={130} onSearch={search} onReset={reset} />
      <Space style={{ marginBottom: 12 }}>
        <Button
          type="primary"
          icon={<PlusSquareOutlined />}
          onClick={() => setEditing({ open: true, record: null })}
        >
          新增
        </Button>
        <Button icon={<CloudUploadOutlined />} onClick={() => setImportOpen(true)}>
          导入
        </Button>
        <Button icon={<ExportOutlined />} onClick={() => exportData('设备管理员配置')}>
          导出
        </Button>
      </Space>
      {/* 增、删、改、导入成功后都刷新当前页（不回到第 1 页） */}
      <DataTable {...tableProps} showIndex columns={columns} />
      <DeviceAdminModal
        open={editing.open}
        record={editing.record}
        onCancel={() => setEditing({ open: false, record: null })}
        onSuccess={() => {
          setEditing({ open: false, record: null });
          reload();
        }}
      />
      <ImportModal
        open={importOpen}
        title="导入"
        templateText="设备管理员配置模板下载"
        emptyTip="请上传导入文件"
        onCancel={() => setImportOpen(false)}
        onOk={async (file) => {
          await importDeviceAdmin(file);
          message.success('导入成功');
          setImportOpen(false);
          reload();
        }}
      />
    </PageContainer>
  );
}
