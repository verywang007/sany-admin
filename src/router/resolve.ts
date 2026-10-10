import { lazy, type ComponentType } from 'react';
import { BUILDING_PREFIX, findLeafByPath } from '@/config/menu';
import { PAGES } from './pages';

const Workbench = lazy(() => import('@/pages/workbench'));
const Building = lazy(() => import('@/pages/exception/Building'));
const NotFound = lazy(() => import('@/pages/exception/NotFound'));

export const HOME_PATH = '/';

export interface ResolvedRoute {
  title: string;
  /** 面包屑：一级模块 → 页面 */
  trail: string[];
  Component: ComponentType;
  closable: boolean;
}

export function resolveRoute(path: string): ResolvedRoute {
  if (path === HOME_PATH) {
    return { title: '工作台', trail: [], Component: Workbench, closable: false };
  }
  const leaf = findLeafByPath(path);
  if (leaf && PAGES[path]) {
    return { title: leaf.name, trail: leaf.trail, Component: PAGES[path], closable: true };
  }
  if (path.startsWith(BUILDING_PREFIX)) {
    const name = decodeURIComponent(path.slice(BUILDING_PREFIX.length));
    return { title: name, trail: leaf?.trail ?? [name], Component: Building, closable: true };
  }
  return { title: '页面不存在', trail: [], Component: NotFound, closable: true };
}
