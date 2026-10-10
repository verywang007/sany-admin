import { TreeSelect } from 'antd';
import type { SearchField } from '@/components/SearchForm';
import type { CountryNode } from '@/services/customer/account';
import { DeviceSwitch } from './components/SearchControls';
import { AUTH_STATUS, AUTH_TYPE, IDENTITY, LOCK_STATUS } from './constants';
import { toOptions } from '@/utils/lookup';

interface CountryOption {
  value: string;
  title: string;
  children?: CountryOption[];
}

const toTree = (nodes: CountryNode[]): CountryOption[] =>
  nodes.map((n) => ({
    value: n.code,
    title: n.name,
    children: n.childNodes && toTree(n.childNodes),
  }));

const noPlaceholder = '';

export function buildFields(countries: CountryNode[]): SearchField[] {
  return [
    { type: 'dateRange', name: 'time', label: '注册日期' },
    { type: 'dateRange', name: 'time1', label: '最近登录日期' },
    { type: 'dateRange', name: 'time2', label: '认证日期' },
    {
      type: 'custom',
      name: 'countryCodes',
      label: '国家',
      render: () => (
        <TreeSelect
          treeData={toTree(countries)}
          treeCheckable
          showCheckedStrategy={TreeSelect.SHOW_CHILD}
          showSearch
          treeNodeFilterProp="title"
          allowClear
          placeholder="请选择"
          maxTagCount={2}
          maxTagTextLength={3}
          maxTagPlaceholder={(omitted) => `+${omitted.length}...`}
        />
      ),
    },
    { type: 'input', name: 'userIds', label: '用户ID', placeholder: '用户ID' },
    { type: 'dateRange', name: 'time3', label: '活跃日期' },
    {
      type: 'select',
      name: 'label',
      label: '印尼试点用户',
      placeholder: noPlaceholder,
      options: [
        { label: '否', value: '0' },
        { label: '是', value: '1' },
      ],
    },
    {
      type: 'select',
      name: 'identity',
      label: '身份',
      mode: 'multiple',
      placeholder: noPlaceholder,
      options: [{ label: '无身份', value: '0' }, ...toOptions(IDENTITY)],
    },
    { type: 'input', name: 'phone', label: '手机号码', placeholder: '手机号码' },
    { type: 'input', name: 'email', label: '邮箱', placeholder: '邮箱' },
    { type: 'input', name: 'crmCustomerNo', label: '客户编码', placeholder: '客户编码' },
    { type: 'input', name: 'alias', label: '昵称/登录用户名', placeholder: '昵称/登录用户名' },
    {
      type: 'select',
      name: 'authStatus',
      label: '认证状态',
      placeholder: noPlaceholder,
      options: toOptions(AUTH_STATUS),
    },
    {
      type: 'select',
      name: 'authType',
      label: '认证类型',
      placeholder: noPlaceholder,
      options: toOptions(AUTH_TYPE),
    },
    {
      type: 'select',
      name: 'lockStatus',
      label: '账户状态',
      placeholder: noPlaceholder,
      options: toOptions(LOCK_STATUS),
    },
    { type: 'custom', name: 'deviceState', label: '已审核设备', render: () => <DeviceSwitch /> },
  ];
}
