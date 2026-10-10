import { useEffect, useMemo, useState, type Key } from 'react';
import { App, Button, Select, Space } from 'antd';
import {
  CloudUploadOutlined,
  ExportOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import PageContainer from '@/components/PageContainer';
import SearchForm, { type SearchField } from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import {
  fetchCountries,
  fetchCrmCustomerList,
  refreshCrmCustomers,
  updateAssessStatus,
  type AssessStatus,
  type Country,
  type CrmCustomer,
  type ImportType,
} from '@/services/customer/certification';
import { useTableQuery } from '@/utils/useTableQuery';
import { usePrototypeActions } from '@/utils/feedback';
import { buildColumns } from './columns';
import {
  ASSESS_COUNTRY_FLAG,
  ASSESS_STATUS,
  AUTH_STATUS,
  CUSTOMER_CATEGORY,
  NOTICE_TITLE,
} from './constants';
import { toOptions } from '@/utils/lookup';
import CrmImportModal from './components/CrmImportModal';

/** 客户认证使用（页头原文为「CRM客户列表」） */
export default function CertificationPage() {
  const { notification } = App.useApp();
  const { exportData } = usePrototypeActions();
  const { tableProps, search, reset, reload } = useTableQuery(fetchCrmCustomerList);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [importType, setImportType] = useState<ImportType>();

  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);

  const fields = useMemo<SearchField[]>(
    () => [
      { type: 'input', name: 'crmCustomerNo', label: '客户编码', placeholder: '' },
      {
        // 原型为 LOV 弹窗选择（CUSTOMER.COUNTRY），这里简化为可搜索的下拉
        type: 'custom',
        name: 'countryCode',
        label: '国家',
        render: () => (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="请选择国家"
            options={countries.map((c) => ({ value: c.cityCode, label: c.cityName }))}
          />
        ),
      },
      {
        type: 'select',
        name: 'crmCustomerCategory',
        label: '客户类别',
        placeholder: '',
        options: toOptions(CUSTOMER_CATEGORY),
      },
      { type: 'dateRange', name: 'time', label: '创建时间', placeholder: ['请选择', '请选择'] },
      {
        type: 'select',
        name: 'authStatus',
        label: '认证状态',
        placeholder: '',
        options: toOptions(AUTH_STATUS),
      },
      {
        type: 'select',
        name: 'assessStatus',
        label: '考核状态',
        placeholder: '',
        options: toOptions(ASSESS_STATUS),
      },
      {
        type: 'select',
        name: 'assessCountryFlag',
        label: '是否为考核国',
        placeholder: '',
        options: toOptions(ASSESS_COUNTRY_FLAG, ['1', '0']),
      },
    ],
    [countries],
  );

  const changeAssess = async (ids: string[], status: AssessStatus) => {
    try {
      await updateAssessStatus(ids, status);
      await reload();
      setSelectedKeys([]);
      notification.success({ message: NOTICE_TITLE, description: '操作成功' });
    } catch {
      notification.error({ message: NOTICE_TITLE, description: '操作失败' });
    }
  };

  const batchChange = (status: AssessStatus) => {
    if (!selectedKeys.length) {
      notification.error({ message: NOTICE_TITLE, description: '请选择需要操作的数据' });
      return;
    }
    changeAssess(selectedKeys.map(String), status);
  };

  const refresh = async () => {
    try {
      await refreshCrmCustomers();
      await reload();
      notification.success({ message: NOTICE_TITLE, description: '刷新成功' });
    } catch {
      notification.error({ message: NOTICE_TITLE, description: '刷新失败' });
    }
  };

  const columns = useMemo(
    () =>
      buildColumns({
        countries,
        onToggleAssess: (r) => changeAssess([r.id], r.assessStatus === '0' ? '1' : '0'),
      }),
    // changeAssess 只依赖稳定的 reload / notification
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [countries, reload],
  );

  return (
    <PageContainer title="CRM客户列表">
      <SearchForm fields={fields} columns={3} labelWidth={100} onSearch={search} onReset={reset} />
      <Space wrap style={{ marginBottom: 12, width: '100%', justifyContent: 'flex-end' }}>
        <Button
          color="default"
          variant="solid"
          icon={<UserDeleteOutlined />}
          onClick={() => batchChange('0')}
        >
          批量剔除考核
        </Button>
        <Button
          type="primary"
          icon={<SafetyCertificateOutlined />}
          onClick={() => batchChange('1')}
        >
          批量重新考核
        </Button>
        <Button icon={<CloudUploadOutlined />} onClick={() => setImportType(2)}>
          导入客户信息
        </Button>
        <Button icon={<CloudUploadOutlined />} onClick={() => setImportType(1)}>
          导入考核国家
        </Button>
        {/* 原型为 HZERO ExcelExport（导出配置弹窗），原型环境统一提示 */}
        <Button
          icon={<ExportOutlined />}
          onClick={() => exportData(`CRM客户列表_${dayjs().format('YYYYMMDD')}`)}
        >
          导出
        </Button>
        <Button icon={<ReloadOutlined />} onClick={refresh}>
          刷新
        </Button>
      </Space>
      <DataTable<CrmCustomer>
        {...tableProps}
        showIndex
        columns={columns}
        rowSelection={{ selectedRowKeys: selectedKeys, onChange: setSelectedKeys, fixed: 'left' }}
      />
      <CrmImportModal
        type={importType}
        onClose={() => setImportType(undefined)}
        onImported={reload}
      />
    </PageContainer>
  );
}
