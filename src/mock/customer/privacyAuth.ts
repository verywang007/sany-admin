import type { PrivacyAuthRecord } from '@/services/customer/privacyAuth';

/**
 * 隐私授权记录的演示数据池：算法与原型脚本 local-mock-query 一致（mulberry32 固定种子）。
 * 原型的同意时间相对 Date.now() 生成、每天不同；这里改为固定基准时间，保证每次结果一致，
 * 基准取规格示例所用的 2026-10-09 10:00:00（本地时间），首页数据与规格示例逐条相同。
 */
export const BASE_TIME = new Date(2026, 9, 9, 10, 0, 0).getTime();

const DAY = 86400000;
const POOL_SIZE = 260;

/** 原型中的 8 种同意类型：数据池按此生成，保证原有数据与规格示例一致 */
const PROTOTYPE_TYPES = [
  '隐私协议',
  '用户服务协议',
  '位置',
  '个性化广告',
  '其他APP活动',
  '相机',
  '无线数据',
  '头像使用',
];
/** 「发送通知」为原型之后新增的类型（APP 首次启动时申请） */
export const ALL_TYPES = [...PROTOTYPE_TYPES, '发送通知'];
/** PC 端只有协议类授权 */
export const PC_TYPES = ['隐私协议', '用户服务协议'];
/**
 * 授权场景编码（值集文案在页面 constants.ts）。PC 端没有首次启动、设置页、功能入口类场景。
 * 推断：原型无此字段，取值按 PRD §6.3 补充。
 */
export const ALL_SCENES = [
  'FIRST_LAUNCH',
  'REGISTER',
  'LOGIN',
  'VERSION_UPDATE',
  'SETTINGS',
  'FEATURE_ENTRY',
];
export const PC_SCENES = ['REGISTER', 'LOGIN', 'VERSION_UPDATE'];
/** 同意类型 → 可能的授权场景（协议类按终端再收窄） */
const SCENES_BY_TYPE: Record<string, string[]> = {
  隐私协议: ['FIRST_LAUNCH', 'REGISTER', 'LOGIN', 'VERSION_UPDATE'],
  用户服务协议: ['FIRST_LAUNCH', 'REGISTER', 'LOGIN', 'VERSION_UPDATE'],
  位置: ['FIRST_LAUNCH'],
  发送通知: ['FIRST_LAUNCH'],
  其他APP活动: ['FIRST_LAUNCH'],
  无线数据: ['FIRST_LAUNCH'],
  相机: ['FEATURE_ENTRY'],
  头像使用: ['FEATURE_ENTRY'],
  个性化广告: ['SETTINGS'],
};
const scenesOf = (type: string, terminal: string) =>
  (SCENES_BY_TYPE[type] ?? []).filter((s) => terminal !== 'PC' || PC_SCENES.includes(s));

/** 来源信息采集上线日期：此前的记录没有授权场景和来源字段（历史数据无法补录） */
export const SOURCE_SINCE = '2025-04-01';

const VERSIONS = ['V1.0', 'V1.2', 'V2.0', 'V2.1', 'V2.5', 'V3.0', 'V3.2'];
const NAMES = [
  '张伟',
  '李建国',
  '王海涛',
  '陈志强',
  '刘敏',
  '赵鹏',
  '孙晓东',
  '周建军',
  '吴国强',
  '郑海峰',
  '马文斌',
  '黄丽华',
  '徐立新',
  '朱永康',
  '何晓峰',
  'Budi Santoso',
  'Ahmad Fauzi',
  'Siti Rahayu',
  'Dewi Lestari',
  'Agus Setiawan',
  'Rizki Pratama',
  'Tan Wei Ming',
  'Lim Choo Kiat',
  'Nguyen Van Hung',
  'Somchai Phuwanat',
  'Raj Kumar',
  'Michael Chen',
  '三一老张',
  '挖机小王',
  '泵车老李',
  '起重机手阿强',
  '矿山设备管家',
];

const pad = (n: number) => (n < 10 ? '0' : '') + n;
const fmt = (ms: number) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};
/** YYYY-MM-DD → 当天 0 点（本地时间） */
const dnum = (s: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]).getTime() : 0;
};

/** mulberry32：固定种子伪随机 */
function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
/** FNV-1a */
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
type Rand = () => number;
const pick = <T>(r: Rand, arr: T[]) => arr[Math.floor(r() * arr.length)];
function mkPhone(r: Rand) {
  const cc = pick(r, ['+86', '+86', '+62', '+65', '+60', '+66']);
  const len = cc === '+86' ? 11 : cc === '+65' ? 8 : 10;
  let s = cc === '+86' ? '1' + '3567889'.charAt(Math.floor(r() * 7)) : '';
  while (s.length < len) s += Math.floor(r() * 10);
  return `${cc} ${s}`;
}
/** 模拟 SHA-256：同一 seed 结果固定 */
function hex(seed: string, words: number) {
  const r = rng(hash(seed));
  return Array.from({ length: words }, () =>
    Math.floor(r() * 4294967296)
      .toString(16)
      .padStart(8, '0'),
  ).join('');
}

const APP_DEVICES: [string, string[]][] = [
  ['iPhone 15 Pro', ['iOS 18.1', 'iOS 17.6']],
  ['iPhone 13', ['iOS 17.6', 'iOS 16.7']],
  ['HUAWEI Mate 60', ['HarmonyOS 4.2']],
  ['Xiaomi 14', ['Android 14']],
  ['OPPO Reno11', ['Android 14']],
  ['vivo X100', ['Android 14']],
  ['Samsung Galaxy A54', ['Android 14', 'Android 13']],
];
const PC_BROWSERS = ['Chrome 128', 'Chrome 126', 'Edge 129', 'Safari 17.6'];
const PC_OS = ['Windows 11', 'Windows 10', 'macOS 14'];
const APP_VERSIONS = ['5.3.2', '5.3.0', '5.2.1', '5.1.0', '5.0.4', '4.8.2'];
const WEB_VERSIONS = ['Web 2.8.0', 'Web 2.7.3', 'Web 2.6.1'];
/** 区号 → [IP 段, 归属地] */
const IP_BY_CC: Record<string, [string, string[]]> = {
  '+86': ['113.87', ['中国 广东 深圳', '中国 湖南 长沙', '中国 北京', '中国 江苏 苏州']],
  '+62': ['103.28', ['印度尼西亚 雅加达', '印度尼西亚 泗水']],
  '+65': ['118.200', ['新加坡']],
  '+60': ['175.139', ['马来西亚 吉隆坡']],
  '+66': ['49.228', ['泰国 曼谷']],
};
const LANG_BY_CC: Record<string, string> = { '+86': 'zh-CN', '+62': 'id-ID' };

type Source = Pick<
  PrivacyAuthRecord,
  | 'scene'
  | 'clientVersion'
  | 'lang'
  | 'device'
  | 'os'
  | 'ip'
  | 'ipRegion'
  | 'deviceIdHash'
  | 'contentHash'
  | 'serverTime'
>;
const NO_SOURCE: Source = {
  scene: '',
  clientVersion: '',
  lang: '',
  device: '',
  os: '',
  ip: '',
  ipRegion: '',
  deviceIdHash: '',
  contentHash: '',
  serverTime: '',
};

/**
 * 授权来源：以记录 id 为种子单独生成，不占用数据池的随机序列，保证原有 7 列与规格示例一致。
 * 同一客户的设备 ID 固定；同一协议、版本、语言的正文哈希相同。
 */
function withSource(row: PrivacyAuthRecord, scene?: string): PrivacyAuthRecord {
  if (row.consentTime.slice(0, 10) < SOURCE_SINCE) return { ...row, ...NO_SOURCE };
  const r = rng(hash(row.id));
  const cc = row.phone.split(' ')[0];
  const app = row.terminal === 'APP';
  const [dev, oses] = pick(r, APP_DEVICES);
  const [ipPrefix, regions] = IP_BY_CC[cc] ?? IP_BY_CC['+86'];
  const lang = LANG_BY_CC[cc] ?? (r() < 0.15 ? 'zh-TW' : 'en-US');
  let candidates = scenesOf(row.consentType, row.terminal);
  // V1.0 是首版，不存在改版后重新同意
  if (row.version === 'V1.0') candidates = candidates.filter((s) => s !== 'VERSION_UPDATE');
  const isAgreement = PC_TYPES.includes(row.consentType);
  const t = new Date(row.consentTime.replace(' ', 'T')).getTime();
  return {
    ...row,
    scene: scene || pick(r, candidates.length ? candidates : ['LOGIN']),
    clientVersion: pick(r, app ? APP_VERSIONS : WEB_VERSIONS),
    lang,
    device: app ? dev : pick(r, PC_BROWSERS),
    os: app ? pick(r, oses) : pick(r, PC_OS),
    ip: `${ipPrefix}.${Math.floor(r() * 254) + 1}.${Math.floor(r() * 254) + 1}`,
    ipRegion: pick(r, regions),
    deviceIdHash: hex(`${row.customerId}|${row.terminal}`, 8),
    contentHash: isAgreement ? hex(`${row.consentType}|${row.version}|${lang}`, 8) : '',
    serverTime: fmt(t + Math.floor(r() * 3000)),
  };
}

const byTimeDesc = (a: PrivacyAuthRecord, b: PrivacyAuthRecord) =>
  a.consentTime < b.consentTime ? 1 : a.consentTime > b.consentTime ? -1 : 0;
type BaseRow = Omit<PrivacyAuthRecord, 'id' | keyof Source>;
/** 只有协议类有版本号；权限类清空（版本号仍照常抽取，不影响随机序列和其他字段） */
const withId = (rows: BaseRow[], prefix: string, scene?: string): PrivacyAuthRecord[] =>
  rows.map((r, i) =>
    withSource(
      {
        id: `${prefix}${i + 1}`,
        ...r,
        version: PC_TYPES.includes(r.consentType) ? r.version : '',
        ...NO_SOURCE,
      },
      scene,
    ),
  );

const NOTIFY_SIZE = 24;

/** 基础数据池：原型 260 条 + 新增「发送通知」24 条，按同意时间倒序 */
export const privacyAuthPool: PrivacyAuthRecord[] = (() => {
  const r = rng(20260923);
  const users = Array.from({ length: 80 }, () => ({
    customerId: String(60000000 + Math.floor(r() * 39999999)),
    alias: pick(r, NAMES),
    phone: mkPhone(r),
  }));
  const rows: BaseRow[] = [];
  for (let k = 0; k < POOL_SIZE; k++) {
    const u = users[Math.floor(r() * users.length)];
    const terminal = r() < 0.82 ? 'APP' : 'PC';
    rows.push({
      ...u,
      terminal,
      consentType: pick(r, terminal === 'PC' ? PC_TYPES : PROTOTYPE_TYPES),
      version: pick(r, VERSIONS),
      consentTime: fmt(BASE_TIME - Math.floor(r() * 730) * DAY - Math.floor(r() * DAY)),
    });
  }
  // 「发送通知」记录用独立种子追加，不影响原型 260 条
  const n = rng(20261023);
  for (let k = 0; k < NOTIFY_SIZE; k++) {
    rows.push({
      ...users[Math.floor(n() * users.length)],
      terminal: 'APP',
      consentType: '发送通知',
      version: pick(n, VERSIONS),
      consentTime: fmt(BASE_TIME - Math.floor(n() * 730) * DAY - Math.floor(n() * DAY)),
    });
  }
  // 先编号再排序，保证 id 稳定
  return withId(rows, 'p').sort(byTimeDesc);
})();

export interface SynthesizeFilters {
  customerId: string;
  alias: string;
  phone: string;
  terminal: string;
  consentType: string;
  version: string;
  scene: string;
  start: string;
  end: string;
}

/**
 * 演示兜底：身份类条件在数据池中查无结果时，按条件现场合成 3~12 条记录；
 * 种子为条件拼接后的哈希，同条件结果固定。真实系统应直接返回后端结果。
 */
export function synthesize(f: SynthesizeFilters): PrivacyAuthRecord[] {
  const seed = [
    f.customerId,
    f.alias,
    f.phone,
    f.terminal,
    f.consentType,
    f.version,
    f.start,
    f.end,
    // 授权场景为新增条件，只在填写时参与种子，保证原有条件的合成结果不变
    ...(f.scene ? [f.scene] : []),
  ].join('|');
  const r = rng(hash(seed));
  const n = 3 + Math.floor(r() * 10);
  const base = {
    customerId: f.customerId || String(60000000 + Math.floor(r() * 39999999)),
    alias: f.alias || pick(r, NAMES),
    phone: f.phone || mkPhone(r),
  };
  let lo = f.start ? dnum(f.start) : BASE_TIME - 730 * DAY;
  // 结束日期包含当天 23:59:59
  let hi = f.end ? dnum(f.end) + 86399000 : BASE_TIME;
  if (hi < lo) hi = lo;
  // 按场景查询时：只合成来源采集上线后、终端和同意类型都与场景相容的记录
  // 未按场景筛选时沿用原型的 8 种类型，保证原有条件的合成结果不变
  let types = PROTOTYPE_TYPES;
  if (f.scene) {
    lo = Math.max(lo, dnum(SOURCE_SINCE));
    types = ALL_TYPES.filter((t) => SCENES_BY_TYPE[t].includes(f.scene));
    if (f.consentType && !types.includes(f.consentType)) return [];
    if (f.terminal === 'PC' && !PC_SCENES.includes(f.scene)) return [];
    if (hi < lo) return [];
  }
  // 按版本号查询时：只有协议类有版本号
  if (f.version) {
    types = types.filter((t) => PC_TYPES.includes(t));
    if (f.consentType && !types.includes(f.consentType)) return [];
    if (!types.length) return [];
  }
  const pcTypes = PC_TYPES.filter((t) => types.includes(t));
  const rows: BaseRow[] = [];
  for (let i = 0; i < n; i++) {
    let terminal = f.terminal || (r() < 0.82 ? 'APP' : 'PC');
    if (!pcTypes.length) terminal = 'APP';
    rows.push({
      ...base,
      terminal,
      consentType: f.consentType || pick(r, terminal === 'PC' ? pcTypes : types),
      version: f.version || pick(r, VERSIONS),
      consentTime: fmt(lo + Math.floor(r() * Math.max(1, hi - lo))),
    });
  }
  return withId(rows, `s${hash(seed)}-`, f.scene).sort(byTimeDesc);
}
