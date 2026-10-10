import { Button, type TableColumnsType } from 'antd';
import type { Country, CrmCustomer } from '@/services/customer/certification';
import { ASSESS_COUNTRY_FLAG, ASSESS_STATUS, AUTH_STATUS, CUSTOMER_CATEGORY } from './constants';
import { lookupText } from '@/utils/lookup';

interface Options {
  countries: Country[];
  onToggleAssess: (row: CrmCustomer) => void;
}

export const buildColumns = ({
  countries,
  onToggleAssess,
}: Options): TableColumnsType<CrmCustomer> => [
  { title: '客户编码', dataIndex: 'crmCustomerNo', width: 110 },
  {
    title: '客户类别',
    dataIndex: 'crmCustomerCategory',
    width: 100,
    render: (v: string) => lookupText(CUSTOMER_CATEGORY, v),
  },
  { title: '经营单位', dataIndex: 'managementUnit', width: 140, ellipsis: true },
  {
    title: '国家',
    dataIndex: 'countryCode',
    width: 100,
    render: (v: string) => countries.find((c) => c.cityCode === v)?.cityName ?? v,
  },
  { title: '公司名称', dataIndex: 'companyName', width: 120, ellipsis: true },
  { title: '联系电话', dataIndex: 'contactPhone', width: 120 },
  { title: '邮箱', dataIndex: 'contactEmail', width: 160, ellipsis: true },
  { title: '联系人姓名', dataIndex: 'contactName', width: 100, ellipsis: true },
  {
    title: '认证状态',
    dataIndex: 'authStatus',
    width: 100,
    render: (v: string) => lookupText(AUTH_STATUS, v),
  },
  { title: '认证用户数量', dataIndex: 'authUserNum', width: 100 },
  {
    title: '是否为考核国',
    dataIndex: 'assessCountryFlag',
    width: 100,
    render: (v: string) => lookupText(ASSESS_COUNTRY_FLAG, v),
  },
  { title: '第一责任人', dataIndex: 'chargeName', width: 100 },
  // 原型表头末尾多一个空格，此处去掉
  { title: '第一责任人飞书账号', dataIndex: 'chargeFlyAccount', width: 160 },
  { title: '第一责任人领导飞书账号', dataIndex: 'chargeLeaderFlyAccount', width: 160 },
  { title: '创建人', dataIndex: 'creatorName', width: 100 },
  { title: '创建人飞书账号', dataIndex: 'creatorFlyAccount', width: 160 },
  { title: '创建人领导飞书账号', dataIndex: 'creatorLeaderFlyAccount', width: 160 },
  { title: '创建时间', dataIndex: 'crmCreationDate', width: 160 },
  {
    title: '考核状态',
    dataIndex: 'assessStatus',
    width: 100,
    render: (v: string) => lookupText(ASSESS_STATUS, v),
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    align: 'center',
    fixed: 'right',
    render: (_v, r) => {
      if (r.assessStatus === '0')
        return (
          <Button type="text" size="small" onClick={() => onToggleAssess(r)}>
            重新考核
          </Button>
        );
      if (r.assessStatus === '1')
        return (
          <Button type="text" size="small" danger onClick={() => onToggleAssess(r)}>
            剔除考核
          </Button>
        );
      return null;
    },
  },
];
