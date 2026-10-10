import { useCallback, useEffect, useState } from 'react';
import { Button, DatePicker, Select } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { TableColumnsType } from 'antd';
import PageContainer from '@/components/PageContainer';
import SearchForm, { type SearchField, type SearchValues } from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import type { Lookup } from '@/components/StatusTag';
import {
  fetchCountryLov,
  type CountryOption,
  type MauUser,
  type UserMetricQuery,
} from '@/services/customer-analysis/mau';
import type { ListFetcher } from '@/types/common';
import { useTableQuery } from '@/utils/useTableQuery';
import { usePrototypeActions } from '@/utils/feedback';
import { colors } from '@/theme';
import styles from './UserMetricReport.module.css';

export interface UserMetricReportConfig {
  /** 页头标题 */
  title: string;
  /** 指标名，显示为「{metricLabel} = {v}%」 */
  metricLabel: string;
  /** 指标公式说明 */
  formula: string;
  /** 导出文件名前缀，实际为 {exportName}_{YYYYMMDD} */
  exportName: string;
  fetchList: ListFetcher<MauUser, UserMetricQuery>;
  /** 指标接口，返回百分数值（如 8.99），无值返回 null */
  fetchRate: (q: UserMetricQuery) => Promise<number | null>;
}

/** 是/否值集（本地定义，查询字段和表格列共用） */
const YES_NO: Lookup = { '1': { text: '是' }, '0': { text: '否' } };
const YES_NO_OPTIONS = Object.entries(YES_NO).map(([value, { text }]) => ({ value, label: text }));
const yesNo = (v: string) => YES_NO[v]?.text ?? v;

const columns: TableColumnsType<MauUser> = [
  { title: '昵称', dataIndex: 'alias', width: 100 },
  { title: '登录用户名', dataIndex: 'loginName', width: 100 },
  { title: '联系电话', dataIndex: 'contactPhone', width: 100 },
  { title: '邮箱', dataIndex: 'email', width: 100 },
  { title: '大区', dataIndex: 'regionName', width: 100 },
  { title: '国家', dataIndex: 'country', width: 100 },
  { title: '印尼试点用户', dataIndex: 'label', width: 100, render: yesNo },
  { title: '是否活跃', dataIndex: 'isActive', width: 100, render: yesNo },
  { title: 'APP版本号', dataIndex: 'appVersion', width: 100 },
  // 最后一列吸收剩余宽度
  { title: '用户ID', dataIndex: 'userId', minWidth: 50 },
];

/** 默认查询月份为当前月；不能选择未来月份 */
const initialValues: UserMetricQuery = { yearMonth: dayjs() };

/**
 * 客户分析 · 用户指标报表（月活跃用户 / 用户留存率共用）：
 * 查询栏 + 指标提示条 + 导出 + 只读表格。指标只在查询条件变化时请求，翻页不重复请求。
 */
export default function UserMetricReport({
  title,
  metricLabel,
  formula,
  exportName,
  fetchList,
  fetchRate,
}: UserMetricReportConfig) {
  const { exportData } = usePrototypeActions();
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [rate, setRate] = useState<number | null>(null);

  const { tableProps, search, reset } = useTableQuery<MauUser, UserMetricQuery>(fetchList, {
    initialQuery: initialValues,
  });

  const loadRate = useCallback(
    (q: UserMetricQuery) =>
      fetchRate(q)
        .then(setRate)
        .catch(() => setRate(null)),
    [fetchRate],
  );

  useEffect(() => {
    fetchCountryLov().then(setCountries);
    loadRate(initialValues);
  }, [loadRate]);

  const fields: SearchField[] = [
    {
      type: 'custom',
      name: 'yearMonth',
      label: '查询月份',
      render: () => (
        <DatePicker
          picker="month"
          style={{ width: '100%' }}
          placeholder="请选择月份"
          disabledDate={(d) => d.isAfter(dayjs(), 'month')}
        />
      ),
    },
    {
      type: 'custom',
      name: 'countryCodes',
      label: '查询国家',
      // 原型为 LOV 多选弹窗，这里用可搜索的多选下拉代替
      render: () => (
        <Select
          mode="multiple"
          allowClear
          showSearch
          optionFilterProp="label"
          maxTagCount="responsive"
          placeholder="请选择国家"
          options={countries.map((c) => ({ value: c.citycode, label: c.cityname }))}
        />
      ),
    },
    {
      type: 'select',
      name: 'label',
      label: '是否印尼标签用户',
      options: YES_NO_OPTIONS,
      placeholder: '',
    },
  ];

  const onSearch = (values: SearchValues) => {
    const q = values as UserMetricQuery;
    search(q);
    loadRate(q);
  };

  const onReset = () => {
    reset();
    loadRate(initialValues);
  };

  return (
    <PageContainer title={title}>
      <SearchForm
        fields={fields}
        columns={3}
        labelWidth={130}
        initialValues={initialValues}
        onSearch={onSearch}
        onReset={onReset}
      />
      <div className={styles.tipsBar}>
        <div className={styles.tips} style={{ color: colors.text }}>
          <div className={styles.metric}>
            {metricLabel} = {rate ?? '--'}%
          </div>
          <div>{formula}</div>
        </div>
        <Button
          type="link"
          icon={<ExportOutlined />}
          onClick={() => exportData(`${exportName}_${dayjs().format('YYYYMMDD')}`)}
        >
          导出
        </Button>
      </div>
      <DataTable {...tableProps} showIndex columns={columns} />
    </PageContainer>
  );
}
