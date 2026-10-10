import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { App, Button, DatePicker, Form, Pagination } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import PageContainer from '@/components/PageContainer';
import SearchForm, { type SearchField } from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import {
  fetchPrivacyAuthList,
  normalizeFilters,
  type PrivacyAuthQuery,
} from '@/services/customer/privacyAuth';
import { useTableQuery } from '@/utils/useTableQuery';
import { usePrototypeActions } from '@/utils/feedback';
import { columns } from './columns';
import { CONSENT_TYPE_OPTIONS, EMPTY_TEXT, TERMINAL_OPTIONS } from './constants';
import { describeFilters } from './describe';
import styles from './index.module.css';

const fields: SearchField[] = [
  { type: 'input', name: 'customerId', label: '客户ID', placeholder: '请输入客户ID' },
  { type: 'input', name: 'alias', label: '客户昵称', placeholder: '请输入客户昵称' },
  { type: 'input', name: 'phone', label: '手机号', placeholder: '请输入手机号' },
  { type: 'select', name: 'terminal', label: 'APP/PC', options: TERMINAL_OPTIONS, placeholder: '' },
  {
    type: 'select',
    name: 'consentType',
    label: '同意类型',
    options: CONSENT_TYPE_OPTIONS,
    placeholder: '',
  },
  { type: 'input', name: 'version', label: '版本号', placeholder: '请输入版本号' },
  {
    type: 'custom',
    name: 'time',
    label: '时间区间',
    // 仅日期，可只填一端
    render: () => (
      <DatePicker.RangePicker
        style={{ width: '100%' }}
        allowEmpty={[true, true]}
        placeholder={['开始日期', '结束日期']}
        separator="~"
      />
    ),
  },
];

const initialValues = { terminal: '', consentType: '' };

/** 隐私授权记录：先筛选后查询，进入页面不自动加载 */
export default function PrivacyAuth() {
  const { message } = App.useApp();
  const { exportData } = usePrototypeActions();
  const { tableProps, total, queried, query, search, reset } = useTableQuery(fetchPrivacyAuthList, {
    immediate: false,
  });
  const { current = 1, pageSize = 20, onChange } = tableProps.pagination;

  // 从「隐私/服务协议管理」点击同意人数跳转过来时带 ?version=，自动按该版本查询
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const version = searchParams.get('version');
  useEffect(() => {
    if (!version) return;
    form.resetFields();
    form.setFieldValue('version', version);
    search(form.getFieldsValue(true) as PrivacyAuthQuery);
    // 只响应链接参数的变化
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);
  const from = total > 0 ? (current - 1) * pageSize + 1 : 1;
  const to = Math.min(current * pageSize, total);

  return (
    <PageContainer
      title="隐私授权记录"
      extra={
        <Button
          type="primary"
          size="small"
          icon={<ExportOutlined />}
          onClick={() =>
            // 推断：原型无导出逻辑；未查询时提示先查询
            queried ? exportData('隐私授权记录') : message.warning('请先查询数据后再导出')
          }
        >
          导出
        </Button>
      }
    >
      <SearchForm
        form={form}
        fields={fields}
        columns={4}
        collapsedRows={2}
        labelWidth={84}
        initialValues={initialValues}
        onSearch={(v) => search(v as PrivacyAuthQuery)}
        onReset={reset}
      />
      {queried && (
        <div className={styles.hint}>
          共查询到 <b>{total}</b> 条授权记录
          <span className={styles.desc}>{describeFilters(normalizeFilters(query))}</span>
        </div>
      )}
      <DataTable
        {...tableProps}
        pagination={false}
        columns={columns}
        locale={{ emptyText: queried ? EMPTY_TEXT.none : EMPTY_TEXT.idle }}
      />
      {/* 分页条常驻：空数据时显示「1 - 0 / 0」且翻页按钮全部禁用 */}
      <div className={styles.pager}>
        <Pagination
          size="small"
          current={current}
          pageSize={pageSize}
          total={total}
          disabled={!queried}
          showSizeChanger
          pageSizeOptions={[10, 20, 50, 100]}
          showTotal={() => `${from} - ${to} / ${total}`}
          onChange={onChange}
        />
      </div>
    </PageContainer>
  );
}
