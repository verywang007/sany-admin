import { useEffect, useMemo, useRef, useState, type CSSProperties, type Key } from 'react';
import { App, Button, Form, type TableProps } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import PageContainer from '@/components/PageContainer';
import SearchForm from '@/components/SearchForm';
import DataTable from '@/components/DataTable';
import {
  batchUnbind,
  fetchAccountList,
  fetchCountryTree,
  importAccounts,
  setDemoStatus,
  setLockStatus,
  updateField,
  type Account,
  type AccountQuery,
  type AuthParams,
  type CountryNode,
} from '@/services/customer/account';
import { useTableQuery } from '@/utils/useTableQuery';
import { usePrototypeActions } from '@/utils/feedback';
import { colors } from '@/theme';
import { getColumns, type MoreAction } from './columns';
import { buildFields } from './searchFields';
import { QUICK_DATES } from './constants';
import CertifyModal from './components/CertifyModal';
import RoleSelectModal from './components/RoleSelectModal';
import CancelAuthModal from './components/CancelAuthModal';
import ResetPasswordModal from './components/ResetPasswordModal';
import EmailModal from './components/EmailModal';
import PhoneModal from './components/PhoneModal';
import styles from './index.module.css';

type ModalKind = 'certify' | 'cancelAuth' | 'resetPwd' | 'email' | 'phone';
type SortParams = Pick<AccountQuery, 'orderByKey' | 'orderByType'>;

/** 认证日期快捷范围：今日 / 昨日 / 本周（周一起） / 本月 */
function quickRange(v: number): [dayjs.Dayjs, dayjs.Dayjs] {
  const now = dayjs();
  if (v === 2) {
    const y = now.subtract(1, 'day');
    return [y.startOf('day'), y.endOf('day')];
  }
  const unit = v === 1 ? 'day' : v === 3 ? 'week' : 'month';
  return [now.startOf(unit), now];
}

/** 客户管理 > 账户管理（页头原文为「账号管理」） */
export default function AccountPage() {
  const { message, modal, notification } = App.useApp();
  const { exportData, notReady } = usePrototypeActions();
  // 原系统进入页面不查询，需要先筛选再查询
  const { tableProps, search, reload, queried } = useTableQuery(fetchAccountList, {
    immediate: false,
  });

  const [form] = Form.useForm();
  const sortRef = useRef<SortParams>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const [countries, setCountries] = useState<CountryNode[]>([]);
  const [quick, setQuick] = useState<number>();
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [modalState, setModalState] = useState<{ kind: ModalKind; record: Account } | null>(null);
  const [rolePending, setRolePending] = useState<AuthParams | null>(null);

  useEffect(() => {
    fetchCountryTree().then(setCountries);
  }, []);

  /** 页头快捷日期、排序也会触发查询，所以条件统一从 form 取（含收起时隐藏的字段） */
  const doSearch = () =>
    search({ ...form.getFieldsValue(true), ...sortRef.current } as AccountQuery);

  const openModal = (kind: ModalKind) => (record: Account) => setModalState({ kind, record });
  const recordOf = (kind: ModalKind) => (modalState?.kind === kind ? modalState.record : null);
  const closeModal = () => setModalState(null);

  const run = async (fn: () => Promise<void>) => {
    try {
      await fn();
      message.success('操作成功');
      reload();
    } catch {
      message.error('操作失败');
    }
  };

  const onMore = (r: Account, action: MoreAction) => {
    const confirm = (title: string, fn: () => Promise<void>) =>
      modal.confirm({ title, onOk: () => run(fn) });
    switch (action) {
      case 'unlock':
        return confirm('确定解锁用户吗？', () => setLockStatus(r.userId, false));
      case 'lock':
        return confirm('确定锁定用户吗？', () => setLockStatus(r.userId, true));
      case 'demoOn':
        // 原系统开启时还会以演示设备号 TC2050CB9073 调用 device-users-auditor/demo/save（不等待结果）
        return confirm('确定开启演示模式吗？', () => setDemoStatus(r.userId, 1));
      case 'demoOff':
        return confirm('确定关闭演示模式吗？', () => setDemoStatus(r.userId, 0));
      case 'authLog':
        // 原系统打开新页签 /customer/authentication-operation-log/{userId}，该页尚未迁移
        return notReady('认证操作日志');
      case 'resetPwd':
        return modal.confirm({ title: '确定重置密码吗？', onOk: () => openModal('resetPwd')(r) });
    }
  };

  const columns = getColumns({
    onEditPhone: openModal('phone'),
    onEditEmail: openModal('email'),
    onUpdateField: (r, field, value) => run(() => updateField(r.userId, field, value)),
    onCertify: openModal('certify'),
    onCancelAuth: openModal('cancelAuth'),
    // 原系统跳转 /auth/{realName}/{loginName}/{contactPhone}/{userId}/{tenantId}，该页尚未迁移
    onDeviceAudit: () => notReady('设备绑定审核'),
    onMore,
  });

  const fields = useMemo(() => buildFields(countries), [countries]);

  const onTableChange: TableProps<Account>['onChange'] = (_p, _f, sorter, { action }) => {
    if (action !== 'sort' || Array.isArray(sorter)) return;
    sortRef.current = sorter.order
      ? {
          orderByKey: sorter.field as keyof Account,
          orderByType: sorter.order === 'ascend' ? 'asc' : 'desc',
        }
      : {};
    doSearch();
  };

  const onQuick = (v: number) => {
    setQuick(v);
    form.setFieldValue('time2', quickRange(v));
    doSearch();
  };

  const onBatchUnbind = () => {
    const rows = tableProps.dataSource.filter((r) => selectedKeys.includes(r.id));
    if (!rows.length) return; // 原系统未勾选时不提示
    modal.confirm({
      title: `您确定要解绑以下【${rows.length}】个用户吗？`,
      content: rows.map((r) => <div key={r.id}>{r.loginName}</div>),
      onOk: async () => {
        try {
          await batchUnbind(rows.map((r) => r.id));
          notification.open({ message: '消息提示', description: '解绑成功' });
          setSelectedKeys([]);
          reload();
        } catch {
          notification.error({ message: '消息提示', description: '解绑失败,请联系管理员' });
        }
      },
    });
  };

  const onImportFile = async (file: File | undefined) => {
    if (fileRef.current) fileRef.current.value = ''; // 允许重复选择同一文件
    if (!file) return;
    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      message.error('仅支持 .xlsx / .xls 格式文件');
      return;
    }
    try {
      await importAccounts(file);
      // 原系统文件名序号是年月日时分的数字相加（如 2083），这里改为 YYYYMMDDHHmm
      message.success(`导入完成，导入结果：账号管理导入_${dayjs().format('YYYYMMDDHHmm')}.xlsx`);
      doSearch();
    } catch (e) {
      notification.error({ message: '导入失败', description: e instanceof Error ? e.message : '' });
    }
  };

  const extra = (
    <>
      <div className={styles.dateOptions}>
        {QUICK_DATES.map((o) => (
          <span
            key={o.value}
            className={`${styles.dateOption} ${quick === o.value ? styles.dateOptionActive : ''}`}
            onClick={() => onQuick(o.value)}
          >
            {o.label}
          </span>
        ))}
      </div>
      <Button type="primary" icon={<ExportOutlined />} onClick={() => exportData('客户管理列表')}>
        导出
      </Button>
      <Button danger type="primary" onClick={onBatchUnbind}>
        批量解绑
      </Button>
      <Button
        type="primary"
        style={{ background: colors.blue }}
        onClick={() => fileRef.current?.click()}
      >
        批量导入
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls"
        hidden
        onChange={(e) => onImportFile(e.target.files?.[0])}
      />
    </>
  );

  return (
    <div className={styles.root} style={{ '--account-primary': colors.primary } as CSSProperties}>
      <PageContainer title="账号管理" extra={extra}>
        <SearchForm
          form={form}
          fields={fields}
          labelWidth={110}
          onSearch={doSearch}
          onReset={() => {
            // 原系统重置会清空条件和快捷日期高亮，并立即按空条件查询
            setQuick(undefined);
            doSearch();
          }}
        />
        <DataTable<Account>
          {...tableProps}
          columns={columns}
          onChange={onTableChange}
          rowSelection={{
            fixed: true,
            columnWidth: 50,
            selectedRowKeys: selectedKeys,
            onChange: setSelectedKeys,
          }}
          locale={{ emptyText: queried ? '暂无数据' : '请添加筛选条件后查询数据' }}
        />
      </PageContainer>
      <CertifyModal
        record={recordOf('certify')}
        onClose={closeModal}
        onSuccess={reload}
        onEnterprise={setRolePending}
      />
      <RoleSelectModal
        params={rolePending}
        onClose={() => setRolePending(null)}
        onSuccess={reload}
      />
      <CancelAuthModal record={recordOf('cancelAuth')} onClose={closeModal} onSuccess={reload} />
      <ResetPasswordModal record={recordOf('resetPwd')} onClose={closeModal} onSuccess={reload} />
      <EmailModal record={recordOf('email')} onClose={closeModal} onSuccess={reload} />
      <PhoneModal record={recordOf('phone')} onClose={closeModal} onSuccess={reload} />
    </div>
  );
}
