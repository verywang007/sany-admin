/**
 * 菜单树：侧栏菜单、路由、页签标题的唯一来源。
 *
 * - 一级为模块，二级为页面，个别二级下还有三级页面。
 * - 叶子节点带 `path` 且在 router/pages.ts 中注册了组件的，是已实现页面；
 *   其余叶子统一进入「建设中」页面。
 * - 新增页面：在这里给叶子补上 path，再到 router/pages.ts 注册组件即可。
 */
export interface MenuNode {
  name: string;
  path?: string;
  children?: MenuNode[];
}

const leaf = (name: string, path?: string): MenuNode => ({ name, path });
const leaves = (...names: string[]): MenuNode[] => names.map((n) => leaf(n));

export const MENU: MenuNode[] = [
  {
    name: '活动管理模块',
    children: [{ name: '人群管理', children: leaves('人群圈选') }, leaf('活动列表')],
  },
  {
    name: '活动管理',
    children: leaves('渠道分析', '产品品鉴官活动', '进群有礼', '充值卡管理', '邀请有礼', '新手权益活动'),
  },
  {
    name: '广告管理',
    children: leaves(
      '首页广告管理',
      '首页工作台配置',
      '咨讯热搜管理',
      '宣传活动列表',
      '活动Banner管理',
      '整机广告管理',
    ),
  },
  { name: '审核检查', children: leaves('检查导入') },
  {
    name: '客户分析',
    children: [
      leaf('月活跃用户', '/customer-analysis/mau'),
      leaf('用户留存率', '/customer-analysis/retention'),
    ],
  },
  {
    name: '客户管理',
    children: [
      leaf('账户管理', '/customer/account'),
      leaf('注销申请管理', '/customer/cancel-apply'),
      leaf('隐私授权记录', '/customer/privacy-auth'),
      leaf('客户分析', '/customer/analysis'),
      leaf('异常申诉', '/customer/appeal'),
      leaf('租户审核', '/customer/tenant-audit'),
      leaf('设备管理员配置', '/customer/device-admin'),
      leaf('组织管理', '/customer/organization'),
      leaf('直接创建租户', '/customer/tenant-create'),
      leaf('客户认证使用', '/customer/certification'),
    ],
  },
  {
    name: '数据管理',
    children: [
      {
        name: '转化率报表',
        children: leaves('漏斗转化率与留存', '用户留存与流失', '设备维护转化率报表', '用户留存率看板'),
      },
      ...leaves('大盘数据', '用户活跃报表', '流失用户分析', '用户管理', '用户群体画像', '用户角色分布'),
    ],
  },
  { name: '设备管理', children: leaves('机型图片配置') },
  {
    name: '反馈管理',
    children: leaves(
      '服务召请&配件询价评价管理',
      'APP功能反馈广告配置',
      '设备数据异常反馈',
      '油耗准确性反馈',
      '反馈管理列表',
      'NPS反馈列表',
    ),
  },
  { name: '圈子管理', children: leaves('数据统计', '话题管理', '内容管理', '内容审核', '数据配置') },
  {
    name: '通用配置',
    children: [
      leaf('设备工况数据源配置'),
      leaf('隐私/服务协议管理', '/general-config/agreement'),
      leaf('公告', '/general-config/announcement'),
    ],
  },
  {
    name: '积分商城管理',
    children: leaves('大区配置', '积分分类配置', '积分商城配置', '积分订单配置', '积分明细'),
  },
  { name: '保养台账管理', children: leaves('保养项目维护', '保养周期维护') },
  {
    name: '运营活动管理',
    children: leaves('礼品卡管理', '活动配置', '商品配置', '订单列表', '新用户列表'),
  },
  { name: '系统设置', children: leaves('邮件服务配置', '邮件模板设置', '触发日志') },
  { name: '开发管理', children: leaves('值集配置', '值集视图配置') },
  { name: '消息管理', children: leaves('消息列表', '消息模板') },
];

/** 未实现页面的路由前缀，后接菜单名 */
export const BUILDING_PREFIX = '/building/';

/** 叶子节点的实际跳转地址：已配 path 用 path，否则进「建设中」 */
export const leafPath = (node: MenuNode) =>
  node.path ?? `${BUILDING_PREFIX}${encodeURIComponent(node.name)}`;

export interface FlatLeaf {
  name: string;
  path: string;
  /** 从一级模块到自身的名称链，用于面包屑和菜单定位 */
  trail: string[];
}

const flatten = (nodes: MenuNode[], trail: string[] = []): FlatLeaf[] =>
  nodes.flatMap((n) =>
    n.children?.length
      ? flatten(n.children, [...trail, n.name])
      : [{ name: n.name, path: leafPath(n), trail: [...trail, n.name] }],
  );

export const FLAT_LEAVES = flatten(MENU);

export const findLeafByPath = (path: string) => FLAT_LEAVES.find((l) => l.path === path);
