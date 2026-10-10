import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/**
 * 路由 → 页面组件 的注册表。key 必须与 config/menu.ts 中叶子节点的 path 一致。
 * 页面按需加载，打开过的页签会保持状态（见 BasicLayout）。
 */
export const PAGES: Record<string, LazyExoticComponent<ComponentType>> = {
  '/customer/tenant-audit': lazy(() => import('@/pages/customer/tenant-audit')),
  '/customer/account': lazy(() => import('@/pages/customer/account')),
  '/customer/cancel-apply': lazy(() => import('@/pages/customer/cancel-apply')),
  '/customer-analysis/mau': lazy(() => import('@/pages/customer-analysis/mau')),
  '/customer-analysis/retention': lazy(() => import('@/pages/customer-analysis/retention')),
  '/customer/appeal': lazy(() => import('@/pages/customer/appeal')),
  '/customer/certification': lazy(() => import('@/pages/customer/certification')),
  '/customer/organization': lazy(() => import('@/pages/customer/organization')),
  '/customer/tenant-create': lazy(() => import('@/pages/customer/tenant-create')),
  '/customer/device-admin': lazy(() => import('@/pages/customer/device-admin')),
  '/customer/analysis': lazy(() => import('@/pages/customer/analysis')),
  '/customer/privacy-auth': lazy(() => import('@/pages/customer/privacy-auth')),
  '/general-config/agreement': lazy(() => import('@/pages/general-config/agreement')),
  '/general-config/announcement': lazy(() => import('@/pages/general-config/announcement')),
};
