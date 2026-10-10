import {
  Button,
  Dropdown,
  type MenuProps,
  type TableColumnType,
  type TableColumnsType,
} from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import type { Account } from '@/services/customer/account';
import { colors } from '@/theme';
import EditCell from './components/EditCell';
import { AUTH_TYPE, CLASSIFICATION, IDENTITY, LABEL, LOCK_STATUS, ROLE } from './constants';
import styles from './index.module.css';

export type MoreAction = 'unlock' | 'lock' | 'demoOn' | 'demoOff' | 'authLog' | 'resetPwd';

export interface ColumnHandlers {
  onEditPhone: (r: Account) => void;
  onEditEmail: (r: Account) => void;
  onUpdateField: (r: Account, field: 'role' | 'identity' | 'label', value: string) => void;
  onCertify: (r: Account) => void;
  onCancelAuth: (r: Account) => void;
  onDeviceAudit: (r: Account) => void;
  onMore: (r: Account, action: MoreAction) => void;
}

const text = (lookup: Record<string, { text: string }>, v: string | undefined) =>
  v ? (lookup[v]?.text ?? v) : '';

function moreItems(r: Account): MenuProps['items'] {
  return [
    // 原系统「解锁用户」「锁定用户」总是同时显示，不按锁定状态隐藏
    { key: 'unlock', label: <span style={{ color: colors.success }}>解锁用户</span> },
    { key: 'lock', label: <span style={{ color: colors.danger }}>锁定用户</span> },
    Number(r.demoStatus) === 0
      ? { key: 'demoOn', label: <span style={{ color: colors.purple }}>开启演示模式</span> }
      : { key: 'demoOff', label: <span style={{ color: colors.danger }}>关闭演示模式</span> },
    { key: 'authLog', label: '认证操作日志' },
    { key: 'resetPwd', label: '重置密码' },
  ];
}

const sortable: TableColumnType<Account> = { sorter: true, sortDirections: ['ascend', 'descend'] };

export function getColumns(h: ColumnHandlers): TableColumnsType<Account> {
  return [
    { title: '昵称', dataIndex: 'alias', width: 100, ellipsis: true },
    { title: '登录用户名', dataIndex: 'loginName', width: 100, ellipsis: true },
    { title: '登录类型', dataIndex: 'firstLoginMethod', width: 100 },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      width: 120,
      render: (v: string, r) => <EditCell text={v} onClick={() => h.onEditPhone(r)} />,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 120,
      render: (v: string, r) => <EditCell text={v} onClick={() => h.onEditEmail(r)} />,
    },
    { title: '大区', dataIndex: 'regionName', width: 100 },
    { title: '国区', dataIndex: 'nationalRegionName', width: 100 },
    { title: '国家', dataIndex: 'country', width: 100 },
    {
      title: '角色',
      dataIndex: 'role',
      width: 140,
      render: (v: string, r) => {
        const name = text(ROLE, v);
        return (
          <EditCell
            text={name && Number(r.demoStatus) === 1 ? `${name}·演示用户` : name}
            menu={ROLE}
            onSelect={(k) => h.onUpdateField(r, 'role', k)}
          />
        );
      },
    },
    {
      title: '身份',
      dataIndex: 'identity',
      width: 160,
      render: (v: string, r) => (
        <EditCell
          tooltip
          text={text(IDENTITY, v)}
          menu={IDENTITY}
          onSelect={(k) => h.onUpdateField(r, 'identity', k)}
        />
      ),
    },
    {
      title: '印尼试点用户',
      dataIndex: 'label',
      width: 100,
      render: (v: string, r) => (
        <EditCell
          tooltip
          text={text(LABEL, v)}
          // 菜单顺序沿用原系统：是、否
          menu={{ '1': LABEL['1'], '0': LABEL['0'] }}
          onSelect={(k) => h.onUpdateField(r, 'label', k)}
        />
      ),
    },
    { title: 'APP版本号', dataIndex: 'appVersion', width: 120 },
    { title: '用户ID', dataIndex: 'userId', width: 120 },
    { title: '最新活跃时间', dataIndex: 'lastActiveTime', width: 160, ...sortable },
    {
      title: '客户类别',
      dataIndex: 'crmCustomerClassification',
      width: 100,
      render: (v: string) => text(CLASSIFICATION, v),
    },
    {
      title: '认证类型',
      dataIndex: 'authTypeCode',
      width: 100,
      render: (v: string) => text(AUTH_TYPE, v),
    },
    {
      title: '已绑定客户编码',
      dataIndex: 'crmBindList',
      width: 120,
      render: (list: Account['crmBindList']) =>
        list.map((b) => <span key={b.id}>{b.crmCustomerNo},</span>),
    },
    { title: '账户星星数', dataIndex: 'starNum', width: 120 },
    { title: '积分数', dataIndex: 'points', width: 100 },
    {
      title: '锁定',
      dataIndex: 'lockStatusCode',
      width: 80,
      render: (v: string) => text(LOCK_STATUS, v),
    },
    { title: '最近登录日期', dataIndex: 'lastLoginTime', width: 150, ...sortable },
    { title: '注册日期', dataIndex: 'creationDate', width: 150, ...sortable },
    { title: '认证日期', dataIndex: 'authDate', width: 150, ...sortable },
    { title: '客户编码', dataIndex: 'crmCustomerNo', width: 120 },
    { title: '服务召请电话', dataIndex: 'serveRecruitmentPhone', width: 120 },
    {
      title: '操作',
      key: 'action',
      width: 350,
      align: 'center',
      fixed: 'right',
      render: (_, r) => {
        const authed = r.authStatus === 1;
        return (
          <div className={styles.ops}>
            {authed ? (
              <Button type="link" size="small" onClick={() => h.onCancelAuth(r)}>
                取消认证
              </Button>
            ) : (
              <Button type="link" size="small" onClick={() => h.onCertify(r)}>
                认证用户
              </Button>
            )}
            {/* 已认证且已绑定客户编码：可以继续绑定其他客户编码 */}
            {authed && r.crmBindList.length > 0 && (
              <Button type="link" size="small" onClick={() => h.onCertify(r)}>
                认证用户
              </Button>
            )}
            <Button type="link" size="small" onClick={() => h.onDeviceAudit(r)}>
              设备绑定审核
            </Button>
            <Dropdown
              menu={{ items: moreItems(r), onClick: ({ key }) => h.onMore(r, key as MoreAction) }}
            >
              <Button type="link" size="small">
                更多
                <CaretDownOutlined />
              </Button>
            </Dropdown>
          </div>
        );
      },
    },
  ];
}
