import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/**
 * 路由 → 页面组件 的注册表。key 必须与 config/menu.ts 中叶子节点的 path 一致。
 * 页面按需加载，打开过的页签会保持状态（见 BasicLayout）。
 */
export const PAGES: Record<string, LazyExoticComponent<ComponentType>> = {
  '/customer/tenant-audit': lazy(() => import('@/pages/customer/tenant-audit')),
};
