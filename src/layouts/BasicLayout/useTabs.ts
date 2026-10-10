import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HOME_PATH } from '@/router/resolve';

/**
 * 多页签状态：访问过的路由按打开顺序保留，工作台始终在首位且不可关闭。
 */
export function useTabs() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [keys, setKeys] = useState<string[]>([HOME_PATH]);

  useEffect(() => {
    setKeys((prev) => (prev.includes(pathname) ? prev : [...prev, pathname]));
  }, [pathname]);

  const close = useCallback(
    (key: string) => {
      if (key === HOME_PATH) return;
      const idx = keys.indexOf(key);
      const next = keys.filter((k) => k !== key);
      setKeys(next);
      if (key === pathname) navigate(next[idx] ?? next[idx - 1] ?? HOME_PATH);
    },
    [keys, navigate, pathname],
  );

  const closeOthers = useCallback(
    (key: string) => {
      setKeys((prev) => prev.filter((k) => k === HOME_PATH || k === key));
      if (key !== pathname) navigate(key);
    },
    [navigate, pathname],
  );

  const closeAll = useCallback(() => {
    setKeys([HOME_PATH]);
    navigate(HOME_PATH);
  }, [navigate]);

  return { keys, activeKey: pathname, close, closeOthers, closeAll };
}
