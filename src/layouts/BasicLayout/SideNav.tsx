import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConfigProvider, Menu, Select, type MenuProps } from 'antd';
import {
  AppstoreOutlined,
  AuditOutlined,
  BarChartOutlined,
  CommentOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  GiftOutlined,
  MessageOutlined,
  NotificationOutlined,
  SearchOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  ToolOutlined,
  CodeOutlined,
  SoundOutlined,
  UsergroupAddOutlined,
  ControlOutlined,
} from '@ant-design/icons';
import { FLAT_LEAVES, MENU, leafPath, type MenuNode } from '@/config/menu';
import { colors } from '@/theme';
import styles from './index.module.css';

const MODULE_ICONS: Record<string, React.ReactNode> = {
  活动管理模块: <AppstoreOutlined />,
  活动管理: <GiftOutlined />,
  广告管理: <SoundOutlined />,
  审核检查: <AuditOutlined />,
  客户分析: <BarChartOutlined />,
  客户管理: <TeamOutlined />,
  数据管理: <DatabaseOutlined />,
  设备管理: <DesktopOutlined />,
  反馈管理: <CommentOutlined />,
  圈子管理: <UsergroupAddOutlined />,
  通用配置: <ControlOutlined />,
  积分商城管理: <ShopOutlined />,
  保养台账管理: <ToolOutlined />,
  运营活动管理: <NotificationOutlined />,
  系统设置: <SettingOutlined />,
  开发管理: <CodeOutlined />,
  消息管理: <MessageOutlined />,
};

type MenuItem = Required<MenuProps>['items'][number];

/** key 规则：分组节点用「路径链」，叶子用跳转地址 */
const toItems = (nodes: MenuNode[], parentKey = '', level = 1): MenuItem[] =>
  nodes.map((n) => {
    const key = `${parentKey}/${n.name}`;
    if (n.children?.length) {
      return {
        key,
        label: n.name,
        icon: level === 1 ? MODULE_ICONS[n.name] : undefined,
        children: toItems(n.children, key, level + 1),
        popupClassName: styles.navPopup,
      };
    }
    return { key: leafPath(n), label: n.name };
  });

interface Props {
  collapsed: boolean;
}

export default function SideNav({ collapsed }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const items = useMemo(() => toItems(MENU), []);

  const current = FLAT_LEAVES.find((l) => l.path === pathname);
  // 高亮当前页面所在的各级分组
  const selectedKeys = current
    ? [pathname, ...current.trail.slice(0, -1).map((_, i) => `/${current.trail.slice(0, i + 1).join('/')}`)]
    : [];

  const searchOptions = useMemo(
    () => FLAT_LEAVES.map((l) => ({ value: l.path, label: l.trail.join(' / ') })),
    [],
  );

  return (
    <nav className={styles.nav} style={{ width: collapsed ? 56 : 220 }}>
      {!collapsed && (
        <div className={styles.navSearch}>
          <Select
            showSearch
            value={null}
            placeholder={
              <span>
                <SearchOutlined /> 菜单搜索
              </span>
            }
            options={searchOptions}
            optionFilterProp="label"
            onSelect={(v) => v && navigate(v)}
            variant="borderless"
            suffixIcon={null}
            className={styles.navSearchSelect}
            popupMatchSelectWidth={280}
          />
        </div>
      )}
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              darkItemBg: colors.nav,
              darkSubMenuItemBg: colors.nav,
              darkPopupBg: '#0a1736',
              darkItemColor: colors.navText,
              darkItemHoverBg: colors.navHover,
              darkItemSelectedBg: '#1d3163',
              itemHeight: 44,
              itemMarginInline: 0,
              itemBorderRadius: 0,
              subMenuItemBorderRadius: 0,
            },
          },
        }}
      >
        <Menu
          className={`${styles.navMenu} ${collapsed ? styles.navMenuCollapsed : ''}`}
          mode="vertical"
          theme="dark"
          items={items}
          selectedKeys={selectedKeys}
          onClick={({ key }) => navigate(key)}
          triggerSubMenuAction="hover"
        />
      </ConfigProvider>
    </nav>
  );
}
