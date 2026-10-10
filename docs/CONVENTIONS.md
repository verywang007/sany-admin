# 开发规范

本工程是 MySANY 管理平台（后管）的高保真原型，技术栈为 React 18 + TypeScript + Ant Design 5 + React Router 6（HashRouter）+ Vite。数据全部来自本地 mock，页面只通过 `services/` 取数，对接真实接口时只需替换 service 层。

## 1. 目录

```
src/
├── config/menu.ts          菜单树，也是路由和页签标题的唯一来源
├── config/app.ts           顶栏信息、当前用户
├── router/pages.ts         路由 → 页面组件 注册表
├── layouts/BasicLayout/    顶栏 + 侧栏 + 多页签（页签保持挂载）
├── theme/                  antd 主题 token、全局样式
├── components/             通用组件（见第 4 节）
├── constants/              跨页面共享的值集
├── services/<模块>/<页面>.ts 实体类型 + 查询/操作函数（当前由 mock 实现）
├── mock/<模块>/<页面>.ts    样本数据
├── utils/                  hooks 与工具函数
├── types/common.ts         分页等通用类型
└── pages/<模块>/<页面>/     页面
```

模块目录：`customer`（客户管理）、`customer-analysis`（客户分析）、`general-config`（通用配置）。

## 2. 新增一个页面

1. 在 `config/menu.ts` 给对应叶子节点补上 `path`，例如 `/customer/account`。
2. 新建 `pages/<模块>/<页面>/index.tsx`，默认导出页面组件。
3. 在 `router/pages.ts` 注册：`'/customer/account': lazy(() => import('@/pages/customer/account'))`。
4. 数据：`mock/` 放样本数据，`services/` 写类型和函数。

没有注册组件的菜单会自动进入「建设中」页面。

## 3. 页面内的文件划分

```
pages/customer/account/
├── index.tsx        页面主体：PageContainer + SearchForm + DataTable
├── columns.tsx      表格列定义
├── constants.ts     仅本页使用的值集、选项（可选）
└── components/      本页的弹窗、抽屉，一个组件一个文件
```

页面文件超过约 300 行就要拆分。

## 4. 通用组件与工具

| 名称 | 用途 |
|---|---|
| `PageContainer` / `PageCard` | 页面骨架：白色页头（标题 + 右侧操作区）+ 灰底内容区 + 白色卡片 |
| `SearchForm` | 查询区：用字段配置生成，支持 input / select / date / dateRange / custom，自带「更多 / 重置 / 查询」 |
| `DataTable` | 表格：带边框、紧凑、横向滚动、统一分页文案；`showIndex` 显示序号列 |
| `StatusTag` | 按值集（`Lookup`）渲染状态，`variant="dot"` 为圆点样式 |
| `ImportModal` | Excel 导入弹窗：校验类型与大小，可下载模板 |
| `useTableQuery` | 列表状态：查询条件、分页、加载态；`immediate: false` 用于“先筛选再查询”的页面 |
| `usePrototypeActions` | 原型里没有落地的动作（导出等）统一给出提示 |
| `mock/utils` | `delay`、`paginate`、`fuzzy`、`exact`、`inRange`、`expand` |

页面里的提示统一用 `App.useApp()` 拿到的 `message` / `modal` / `notification`，不要直接调用静态方法 `message.xxx`（拿不到主题）。

## 5. 编码约定

- TypeScript 严格模式，不用 `any`；实体类型写在对应的 service 文件里并导出。
- 命名：目录和路由用 kebab-case，组件用 PascalCase，变量和函数用 camelCase，常量用 UPPER_SNAKE_CASE。
- 列表数据每行都必须有唯一的 `id`（`DataTable` 默认 `rowKey="id"`）。
- 颜色从 `@/theme` 的 `colors` 取，不要写死色值；局部样式用 CSS Modules（`index.module.css`）。
- 值集用 `Lookup` 结构（编码 → `{ text, color }`）；编码与方案文档保持一致，如 `MYSANY.ACCOUNT_CANCEL_STATUS`。
- 界面文案保留原型原文。原型中的明显缺陷修正后，在代码注释里写明。
- 提交前运行 `npm run typecheck` 和 `npm run lint`，代码由 Prettier 统一格式化（`npm run format`）。

## 6. Git

- 分支：`main` 为稳定分支，开发使用 `feat/<页面>`、`fix/<问题>`。
- 提交信息采用 Conventional Commits：`feat: 新增账户管理页`、`fix: 修复公告筛选不生效`、`docs: 更新 PRD`。
