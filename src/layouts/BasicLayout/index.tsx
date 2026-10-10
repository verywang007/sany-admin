import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Spin, Tabs, Watermark } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { CURRENT_USER } from '@/config/app';
import { resolveRoute } from '@/router/resolve';
import Header from './Header';
import SideNav from './SideNav';
import { useTabs } from './useTabs';
import styles from './index.module.css';

/**
 * 主布局：顶栏 + 侧栏 + 多页签内容区。
 * 已打开的页签全部保持挂载（切换页签不丢失查询条件、表单输入等状态），关闭页签才卸载。
 */
export default function BasicLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { keys, activeKey, close, closeOthers, closeAll } = useTabs();

  const tabItems = keys.map((key) => {
    const route = resolveRoute(key);
    return {
      key,
      closable: route.closable,
      label: (
        <Dropdown
          trigger={['contextMenu']}
          menu={{
            items: [
              { key: 'close', label: '关闭当前', disabled: !route.closable },
              { key: 'others', label: '关闭其他' },
              { key: 'all', label: '关闭全部' },
            ],
            onClick: ({ key: action }) => {
              if (action === 'close') close(key);
              if (action === 'others') closeOthers(key);
              if (action === 'all') closeAll();
            },
          }}
        >
          <span>
            {route.closable ? null : <HomeOutlined />}
            {route.title}
          </span>
        </Dropdown>
      ),
    };
  });

  return (
    <div className={styles.container}>
      <Header collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className={styles.body}>
        <SideNav collapsed={collapsed} />
        <main className={styles.main}>
          <Tabs
            className={styles.tabs}
            type="editable-card"
            hideAdd
            size="small"
            activeKey={activeKey}
            items={tabItems}
            onChange={(k) => navigate(k)}
            onEdit={(k, action) => action === 'remove' && close(String(k))}
          />
          <Watermark
            className={styles.content}
            content={CURRENT_USER.name}
            font={{ color: 'rgba(170, 170, 170, 0.2)', fontSize: 12 }}
            rotate={-15}
            width={210}
            height={60}
            gap={[160, 58]}
          >
            {keys.map((key) => {
              const { Component } = resolveRoute(key);
              return (
                <div key={key} className={styles.pane} hidden={key !== activeKey}>
                  <Suspense fallback={<Spin className={styles.loading} />}>
                    <Component />
                  </Suspense>
                </div>
              );
            })}
          </Watermark>
        </main>
      </div>
    </div>
  );
}
