# MySANY 管理平台（后管）原型 · 修改指南

本文件说明怎么定位页面、怎么改常见内容，供 Claude 和团队成员共用。完整规范见 `docs/CONVENTIONS.md`。

- 技术栈：React 18 + TypeScript + Ant Design 5 + React Router 6（HashRouter）+ Vite
- 数据全部是本地 mock，页面只通过 `src/services/` 取数
- 启动：`npm run dev`（http://localhost:5173）；检查：`npm run typecheck`、`npm run lint`；构建：`npm run build`
- 界面文案保留原型原文（中文）；回复使用中文

## 1. 按菜单找页面

页面目录都在 `src/pages/` 下；service 和 mock 文件与页面同名，分别在 `src/services/<模块>/`、`src/mock/<模块>/` 下。

| 一级菜单 | 菜单 | 页面目录 | service / mock 文件名 |
|---|---|---|---|
| 客户分析 | 月活跃用户 | `customer-analysis/mau` | `mau.ts` |
| 客户分析 | 用户留存率 | `customer-analysis/retention` | `retention.ts` |
| 客户管理 | 账户管理 | `customer/account` | `account.ts` |
| 客户管理 | 注销申请管理 | `customer/cancel-apply` | `cancelApply.ts` |
| 客户管理 | 隐私授权记录 | `customer/privacy-auth` | `privacyAuth.ts` |
| 客户管理 | 客户分析 | `customer/analysis` | `customerAnalysis.ts` |
| 客户管理 | 异常申诉 | `customer/appeal` | `appeal.ts` |
| 客户管理 | 租户审核 | `customer/tenant-audit` | `tenantAudit.ts` |
| 客户管理 | 设备管理员配置 | `customer/device-admin` | `deviceAdmin.ts` |
| 客户管理 | 组织管理 | `customer/organization` | `organization.ts` |
| 客户管理 | 直接创建租户 | `customer/tenant-create` | `tenantCreate.ts` |
| 客户管理 | 客户认证使用 | `customer/certification` | `certification.ts` |
| 通用配置 | 隐私/服务协议管理 | `general-config/agreement` | `agreement.ts` |
| 通用配置 | 公告 | `general-config/announcement` | `announcement.ts` |

注意：

- 有两个“客户分析”：一级菜单“客户分析”（包含月活、留存），以及“客户管理 → 客户分析”（`customer/analysis`）。没说清时先确认是哪一个。
- 月活跃用户和用户留存率共用 `customer-analysis/components/UserMetricReport.tsx`，两个页面的 `index.tsx` 只传配置。改这两页的结构，改的是共享组件。
- 页头标题可能和菜单名不同：租户审核的页头是“租户管理”，账户管理是“账号管理”，异常申诉是“异常申诉清单”，客户认证使用是“CRM客户列表”，组织管理是“客户组织管理”。
- 其余菜单都没有页面，点击后显示“建设中”。

## 2. 页面目录里的文件分工

| 要改的部位 | 位置 |
|---|---|
| 页头标题、页头右侧按钮 | `index.tsx` 中的 `<PageContainer title extra>` |
| 查询条件 | `index.tsx` 中的 `fields` 数组（账户管理在 `searchFields.tsx`） |
| 表格上方工具栏按钮 | `index.tsx` 中，`<DataTable>` 前面的按钮组 |
| 表格列、行内操作按钮 | `columns.tsx`（操作列一般在最后） |
| 弹窗、抽屉、编辑视图 | `components/`，一个组件一个文件；文件名就是组件用途，如 `DetailModal.tsx`、`EditView.tsx` |
| 下拉选项、状态文案和颜色（值集） | `constants.ts`（注销状态在 `src/constants/accountCancel.ts`） |
| 页面局部样式 | `index.module.css` |
| 查询、增删改逻辑和字段类型 | `src/services/<模块>/<文件>.ts` |
| 示例数据 | `src/mock/<模块>/<文件>.ts` |

定位技巧：用页面上能看到的原文（按钮名、列名、弹窗标题、提示语）在页面目录里 grep，通常一次就能定位到。

## 3. 常见修改怎么做

### 查询条件
在 `fields` 里增删一项即可。支持的类型：`input`、`select`（带 `options`）、`date`、`month`、`dateRange`（`showTime` 带时分秒）、`custom`（`render` 自定义控件）。`name` 要和 service 中 `XxxQuery` 的字段对应，并在 service 的过滤函数里补上匹配逻辑（工具函数在 `src/mock/utils.ts`：`fuzzy` 模糊匹配，`exact` 精确匹配，`inRange` 日期区间）。

### 表格列
在 `columns.tsx` 里增删一项。新增字段时同步改三处：service 的实体类型、mock 数据、列定义。状态类列用 `<StatusTag lookup={值集} value={...} />`，单行省略用 `ellipsis: true`。

### 按钮
- **单个页面的按钮**：在 `index.tsx`（页头或工具栏）或 `columns.tsx`（行内操作）里改 antd 的 `<Button>`。主按钮用 `type="primary"`，文字按钮用 `type="link"`，危险操作用 `danger`。
- **行内按钮按条件显示**：在 `columns.tsx` 操作列的 `render` 里判断行数据。
- **点击后暂时只做提示**：用 `usePrototypeActions()`，其中 `exportData('名称')` 用于导出，`notReady('操作名')` 用于未实现的功能。
- **全局按钮样式（颜色、圆角、高度）**：改 `src/theme/index.ts` 的 token，所有页面一起生效。
- **查询区的“更多 / 重置 / 查询”**：在 `src/components/SearchForm/index.tsx`，改动会影响所有页面。

### 弹窗
在页面的 `components/` 下新建文件，参考同页已有的弹窗。页面里用 state 控制 `open`。提示统一用 `const { message, modal, notification } = App.useApp()`，不要用静态的 `message.xxx`。

### 状态、下拉选项、颜色
改页面 `constants.ts` 中的值集（编码 → `{ text, color }`）。颜色优先从 `src/theme` 的 `colors` 取。转成下拉选项用 `toOptions`，取文案用 `lookupText`，两者都在 `src/utils/lookup.ts`。

### 示例数据
直接改 `src/mock/` 下对应文件。需要更多条数演示分页时，service 里用 `expand(样本, 总数, 变换函数)` 补齐。

### 新增菜单页面
1. 在 `src/config/menu.ts` 给对应叶子节点补上 `path`。
2. 新建 `src/pages/<模块>/<页面>/index.tsx`，参考 `customer/tenant-audit`，它是最简单的完整示例。
3. 在 `src/router/pages.ts` 注册：`'/路径': lazy(() => import('@/pages/...'))`。
4. 新建同名的 service 和 mock 文件。
5. 在 `src/config/directory.ts` 中给新页面配置功能分组、用途和角色，场景目录（`#/directory`）会按配置展示；没配置的页面会归入「其他」。

复杂页面（状态流转、多弹窗、编辑视图）的需求按 `docs/templates/NEW-PAGE-TEMPLATE.md` 填写，放在 `docs/requirements/` 下。照需求实现时：没写的部分参考需求里指定的「参考页面」补全，完成后列出所有补全和推断的内容，请用户确认。

### 改外壳（顶栏、侧栏、页签、水印）
- 顶栏：`src/layouts/BasicLayout/Header.tsx`
- 侧栏：`src/layouts/BasicLayout/SideNav.tsx`
- 页签：`src/layouts/BasicLayout/useTabs.ts`
- 水印：`src/layouts/BasicLayout/index.tsx`
- 顶栏文字、当前用户：`src/config/app.ts`
- 菜单名称和顺序：`src/config/menu.ts`

## 4. 通用组件（`src/components/`）

`PageContainer` / `PageCard` 页面骨架 · `SearchForm` 查询区 · `DataTable` 表格 · `StatusTag` 状态标签 · `ImportModal` 导入弹窗 · `LangTabs` 多语言页签 · `RichEditor` 富文本 · `EditForm` 编辑视图的 Field / Card 骨架 · `CancelReasonModal` 取消发布原因。列表状态用 `src/utils/useTableQuery.ts` 管理。

改通用组件会影响多个页面，改之前先 grep 引用处。

## 5. 改完后检查

1. 运行 `npm run typecheck` 和 `npm run lint`。
2. 浏览器打开 `http://localhost:5173/#/<路由>` 查看效果，路由即第 1 节中的目录路径，如 `#/customer/account`。
3. 移动或重命名文件后，检查 `.css` 的 import 路径：CSS Modules 的类型声明是通配的，tsc 发现不了这类错误，只会在浏览器里报错。

## 6. 容易踩的坑

- 打开过的页签会保持挂载，切换页签时组件不会卸载。页面里依赖路由参数的逻辑要监听参数变化，不能只在挂载时读一次。
- 每行数据都必须有唯一的 `id`，`DataTable` 默认 `rowKey="id"`。
- 需要在查询区外读写查询条件时（统计卡、快捷日期等），在页面里用 `Form.useForm()` 创建实例，传给 `<SearchForm form={form}>`。
- 原型缺陷的修正要在代码注释里写明原因，原型规格见 `docs/page-specs/`。
