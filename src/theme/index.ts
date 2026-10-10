import type { ThemeConfig } from 'antd';

/**
 * 设计 token：颜色从现网 HZERO 页面取样。
 * 业务代码里需要颜色时引用这里，不要写死色值。
 */
export const colors = {
  primary: '#29bece',
  header: '#172742',
  nav: '#1e3255',
  navHover: '#253d68',
  navSearch: '#425370',
  navText: '#c3cee8',
  navActiveFrom: '#1f4364',
  navActiveTo: '#28b7c8',
  /** 查询区按钮（展开/查询/重置）使用的深蓝 */
  navy: '#1e3255',
  danger: '#d50000',
  indigo: '#3f51b5',
  success: '#27b883',
  warning: '#f59d3d',
  error: '#e35d6a',
  purple: '#8e6be8',
  blue: '#3f86f7',
  pageBg: '#f4f5f7',
  border: '#dfe4eb',
  text: '#333333',
  textSecondary: '#8b97aa',
};

export const layout = {
  headerHeight: 48,
  navWidth: 220,
  navCollapsedWidth: 56,
  tabBarHeight: 36,
};

export const theme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorInfo: colors.primary,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorText: colors.text,
    colorBgLayout: colors.pageBg,
    colorBorderSecondary: '#e8ebf0',
    borderRadius: 2,
    fontSize: 13,
    fontFamily:
      '"PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    controlHeight: 30,
  },
  components: {
    Table: {
      headerBg: '#f5f7fa',
      headerColor: '#353535',
      cellPaddingBlock: 12,
      cellPaddingBlockSM: 8,
    },
    Tabs: {
      horizontalMargin: '0',
    },
    Modal: {
      titleFontSize: 15,
    },
  },
};
