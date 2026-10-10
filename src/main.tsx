import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { App as AntApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { theme } from '@/theme';
import BasicLayout from '@/layouts/BasicLayout';
import '@/theme/global.css';

dayjs.locale('zh-cn');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN} theme={theme} button={{ autoInsertSpace: false }}>
      <AntApp>
        {/* HashRouter：静态部署无需服务端改写规则 */}
        <HashRouter>
          <Routes>
            <Route path="*" element={<BasicLayout />} />
          </Routes>
        </HashRouter>
      </AntApp>
    </ConfigProvider>
  </StrictMode>,
);
