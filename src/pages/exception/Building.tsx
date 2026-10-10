import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Result } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import { BUILDING_PREFIX } from '@/config/menu';

export default function Building() {
  const { pathname } = useLocation();
  // 页签保持挂载，切到别的页签后 pathname 会变，所以只在挂载时取一次菜单名
  const [name] = useState(() =>
    pathname.startsWith(BUILDING_PREFIX) ? decodeURIComponent(pathname.slice(BUILDING_PREFIX.length)) : '',
  );
  return (
    <Result
      icon={<ToolOutlined style={{ color: '#29bece' }} />}
      title={`${name ? `「${name}」` : '该页面'}建设中`}
      subTitle="原型尚未覆盖此菜单，敬请期待"
    />
  );
}
