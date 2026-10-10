import { App, Avatar, Badge, Dropdown, type MenuProps } from 'antd';
import {
  BellFilled,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  APP_TITLE,
  CURRENT_USER,
  LANGUAGE_OPTIONS,
  SITE_OPTIONS,
  TENANT_OPTIONS,
} from '@/config/app';
import styles from './index.module.css';

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

function HeaderSwitch({ value, options }: { value: string; options: string[] }) {
  const { message } = App.useApp();
  const items: MenuProps['items'] = options.map((o) => ({ key: o, label: o }));
  return (
    <Dropdown
      menu={{
        items,
        selectable: true,
        selectedKeys: [value],
        onClick: () => message.info('原型环境不支持切换'),
      }}
      trigger={['click']}
    >
      <span className={styles.headerItem}>
        {value} <DownOutlined className={styles.headerChevron} />
      </span>
    </Dropdown>
  );
}

export default function Header({ collapsed, onToggle }: Props) {
  const { message } = App.useApp();
  const userMenu: MenuProps['items'] = [
    { key: 'center', label: '个人中心' },
    { type: 'divider' },
    { key: 'logout', label: '退出登录' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.brand} style={{ width: collapsed ? 56 : 220 }}>
        <span className={styles.brandLogo} />
        {!collapsed && <h1 className={styles.brandTitle}>{APP_TITLE}</h1>}
      </div>
      <span className={styles.collapseTrigger} onClick={onToggle}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </span>
      <div className={styles.headerRight}>
        <HeaderSwitch value={SITE_OPTIONS[0]} options={SITE_OPTIONS} />
        <span className={styles.headerDivider} />
        <HeaderSwitch value={TENANT_OPTIONS[0]} options={TENANT_OPTIONS} />
        <HeaderSwitch value={LANGUAGE_OPTIONS[0]} options={LANGUAGE_OPTIONS} />
        <span className={styles.headerItem} onClick={() => message.info('暂无新消息')}>
          <Badge dot offset={[-2, 2]}>
            <BellFilled className={styles.headerIcon} />
          </Badge>
        </span>
        <Dropdown
          menu={{ items: userMenu, onClick: () => message.info('原型环境不支持该操作') }}
          trigger={['click']}
        >
          <span className={styles.headerItem}>
            <Avatar size={28} icon={<UserOutlined />} className={styles.avatar} />
            {CURRENT_USER.name} <DownOutlined className={styles.headerChevron} />
          </span>
        </Dropdown>
      </div>
    </header>
  );
}
