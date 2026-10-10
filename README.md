# MySANY 管理平台（后管）前端原型

后管功能的高保真交互原型，与 PRD / 方案文档一起维护，供产品评审和研发对照实现。

- 技术栈：React 18 + TypeScript + Ant Design 5 + React Router 6 + Vite
- 数据：全部为本地 mock（`src/mock`），页面通过 `src/services` 取数，不依赖后端

## 快速开始

需要 Node.js 18 及以上版本。

```bash
npm install      # 首次安装依赖
npm run dev      # 启动开发服务器，浏览器打开 http://localhost:5173
```

修改代码并保存后，浏览器会自动刷新。

| 命令 | 说明 |
|---|---|
| `npm run dev` | 本地开发 |
| `npm run build` | 类型检查并打包到 `dist/` |
| `npm run preview` | 本地预览打包结果 |
| `npm run typecheck` | 仅类型检查 |
| `npm run lint` | ESLint 检查 |
| `npm run format` | Prettier 格式化 |

## 页面清单

| 模块 | 页面 | 路由 | 相关文档 |
|---|---|---|---|
| 客户分析 | 月活跃用户 | `#/customer-analysis/mau` | |
| 客户分析 | 用户留存率 | `#/customer-analysis/retention` | |
| 客户管理 | 账户管理 | `#/customer/account` | |
| 客户管理 | 注销申请管理 | `#/customer/cancel-apply` | [账户注销方案](docs/客户管理-账户注销-方案.md) |
| 客户管理 | 隐私授权记录 | `#/customer/privacy-auth` | |
| 客户管理 | 客户分析 | `#/customer/analysis` | |
| 客户管理 | 异常申诉 | `#/customer/appeal` | |
| 客户管理 | 租户审核 | `#/customer/tenant-audit` | |
| 客户管理 | 设备管理员配置 | `#/customer/device-admin` | |
| 客户管理 | 组织管理 | `#/customer/organization` | |
| 客户管理 | 直接创建租户 | `#/customer/tenant-create` | |
| 客户管理 | 客户认证使用 | `#/customer/certification` | |
| 通用配置 | 隐私/服务协议管理 | `#/general-config/agreement` | [协议管理方案](docs/通用配置-隐私服务协议管理-方案.md) |
| 通用配置 | 公告 | `#/general-config/announcement` | [公告 PRD](docs/通用配置-公告-PRD.md) |

其余菜单保留在侧栏中，点击后显示「建设中」。

## 目录与规范

目录结构、新增页面的步骤、通用组件和编码约定见 [docs/CONVENTIONS.md](docs/CONVENTIONS.md)。

各页面的原型规格（字段、交互规则、已修正的原型缺陷）见 [docs/page-specs/](docs/page-specs/)。

## 对接真实接口

页面只调用 `src/services/**` 导出的函数，函数签名就是接口契约（入参为查询条件 + 分页，出参为 `{ list, total }`）。对接时把函数体里的 mock 逻辑换成真实请求即可，页面代码无需改动。
