/**
 * 场景目录（#/directory）的分类配置：每个已实现页面属于哪个功能分组、主要由哪些角色使用。
 *
 * - key 为页面路由，须与 config/menu.ts 中的 path 一致；
 *   已注册但未在这里配置的页面，会自动归入「其他」分组，不会漏掉。
 * - 角色来源：注销申请管理见《账户注销方案》§8.1，公告见《公告 PRD》第三节；
 *   其余页面的角色是按业务推断的（inferred: true），评审时请确认。
 */

export const FUNCTION_GROUPS = [
  { key: 'account', title: '账号与认证', desc: '客户账号的查询、认证与异常处理' },
  {
    key: 'tenant',
    title: '租户与组织',
    desc: '企业 / 代理商租户的申请、创建，以及组织和设备管理员',
  },
  { key: 'privacy', title: '隐私与合规', desc: '协议版本发布、用户授权记录与账号注销' },
  { key: 'analysis', title: '数据分析', desc: '活跃、留存与客户分布等运营指标' },
  { key: 'notice', title: '平台通知', desc: '面向后管用户的系统公告' },
] as const;

export const ROLES = [
  { key: 'cs', title: '客服专员', desc: '受理用户问题、代客操作' },
  { key: 'ops', title: '运营主管', desc: '审核、配置与运营数据' },
  { key: 'admin', title: '系统管理员', desc: '平台配置、异常任务处理' },
  { key: 'legal', title: '合规/法务', desc: '协议、授权与注销的合规留痕' },
] as const;

export type FunctionGroupKey = (typeof FUNCTION_GROUPS)[number]['key'];
export type RoleKey = (typeof ROLES)[number]['key'];

export interface DirectoryEntry {
  group: FunctionGroupKey;
  /** 页面用途，一句话 */
  desc: string;
  roles: RoleKey[];
  /** 角色是否为推断（文档中未定义） */
  inferred?: boolean;
}

export const DIRECTORY: Record<string, DirectoryEntry> = {
  '/customer/account': {
    group: 'account',
    desc: '客户账号查询，认证 / 取消认证、解绑、锁定与重置密码',
    roles: ['cs', 'ops'],
    inferred: true,
  },
  '/customer/certification': {
    group: 'account',
    desc: 'CRM 客户的考核状态管理，导入客户与考核国家',
    roles: ['ops'],
    inferred: true,
  },
  '/customer/appeal': {
    group: 'account',
    desc: '用户提交的设备异常申诉，回复与查看处理记录',
    roles: ['cs'],
    inferred: true,
  },
  '/customer/tenant-audit': {
    group: 'tenant',
    desc: '企业客户 / 代理商的租户申请记录',
    roles: ['ops'],
    inferred: true,
  },
  '/customer/tenant-create': {
    group: 'tenant',
    desc: '后台直接创建企业客户或代理商租户',
    roles: ['ops', 'admin'],
    inferred: true,
  },
  '/customer/organization': {
    group: 'tenant',
    desc: '客户组织及其成员管理',
    roles: ['ops'],
    inferred: true,
  },
  '/customer/device-admin': {
    group: 'tenant',
    desc: '客户设备管理员的新增、编辑、删除与批量导入',
    roles: ['ops', 'cs'],
    inferred: true,
  },
  '/general-config/agreement': {
    group: 'privacy',
    desc: '隐私政策、用户服务协议的多语言版本编辑、发布与生效',
    roles: ['legal', 'admin'],
    inferred: true,
  },
  '/customer/privacy-auth': {
    group: 'privacy',
    desc: '用户对各协议、权限的同意记录查询',
    roles: ['legal', 'cs'],
    inferred: true,
  },
  '/customer/cancel-apply': {
    group: 'privacy',
    desc: '账号注销申请的审核、冷静期与执行跟踪',
    roles: ['cs', 'ops', 'admin', 'legal'],
  },
  '/customer-analysis/mau': {
    group: 'analysis',
    desc: '按月统计活跃用户与活跃率',
    roles: ['ops'],
    inferred: true,
  },
  '/customer-analysis/retention': {
    group: 'analysis',
    desc: '按月统计新注册用户的留存率',
    roles: ['ops'],
    inferred: true,
  },
  '/customer/analysis': {
    group: 'analysis',
    desc: '按国家统计新增客户与总客户数，导出明细',
    roles: ['ops'],
    inferred: true,
  },
  '/general-config/announcement': {
    group: 'notice',
    desc: '后管系统公告的发布、强制阅读与阅读统计',
    roles: ['ops', 'admin', 'legal'],
  },
};
