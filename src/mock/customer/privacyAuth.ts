import type { PrivacyAuthRecord } from '@/services/customer/privacyAuth';

/**
 * 隐私授权记录的演示数据池：算法与原型脚本 local-mock-query 一致（mulberry32 固定种子）。
 * 原型的同意时间相对 Date.now() 生成、每天不同；这里改为固定基准时间，保证每次结果一致，
 * 基准取规格示例所用的 2026-10-09 10:00:00（本地时间），首页数据与规格示例逐条相同。
 */
export const BASE_TIME = new Date(2026, 9, 9, 10, 0, 0).getTime();

const DAY = 86400000;
const POOL_SIZE = 260;

export const ALL_TYPES = [
  '隐私协议',
  '用户服务协议',
  '位置',
  '个性化广告',
  '其他APP活动',
  '相机',
  '无线数据',
  '头像使用',
];
/** PC 端只有协议类授权 */
export const PC_TYPES = ['隐私协议', '用户服务协议'];
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
const byTimeDesc = (a: PrivacyAuthRecord, b: PrivacyAuthRecord) =>
  a.consentTime < b.consentTime ? 1 : a.consentTime > b.consentTime ? -1 : 0;
const withId = (rows: Omit<PrivacyAuthRecord, 'id'>[], prefix: string): PrivacyAuthRecord[] =>
  rows.map((r, i) => ({ id: `${prefix}${i + 1}`, ...r }));

/** 基础数据池：260 条，约 78 个不同客户，按同意时间倒序 */
export const privacyAuthPool: PrivacyAuthRecord[] = (() => {
  const r = rng(20260923);
  const users = Array.from({ length: 80 }, () => ({
    customerId: String(60000000 + Math.floor(r() * 39999999)),
    alias: pick(r, NAMES),
    phone: mkPhone(r),
  }));
  const rows: Omit<PrivacyAuthRecord, 'id'>[] = [];
  for (let k = 0; k < POOL_SIZE; k++) {
    const u = users[Math.floor(r() * users.length)];
    const terminal = r() < 0.82 ? 'APP' : 'PC';
    rows.push({
      ...u,
      terminal,
      consentType: pick(r, terminal === 'PC' ? PC_TYPES : ALL_TYPES),
      version: pick(r, VERSIONS),
      consentTime: fmt(BASE_TIME - Math.floor(r() * 730) * DAY - Math.floor(r() * DAY)),
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
  ].join('|');
  const r = rng(hash(seed));
  const n = 3 + Math.floor(r() * 10);
  const base = {
    customerId: f.customerId || String(60000000 + Math.floor(r() * 39999999)),
    alias: f.alias || pick(r, NAMES),
    phone: f.phone || mkPhone(r),
  };
  const lo = f.start ? dnum(f.start) : BASE_TIME - 730 * DAY;
  // 结束日期包含当天 23:59:59
  let hi = f.end ? dnum(f.end) + 86399000 : BASE_TIME;
  if (hi < lo) hi = lo;
  const rows: Omit<PrivacyAuthRecord, 'id'>[] = [];
  for (let i = 0; i < n; i++) {
    const terminal = f.terminal || (r() < 0.82 ? 'APP' : 'PC');
    rows.push({
      ...base,
      terminal,
      consentType: f.consentType || pick(r, terminal === 'PC' ? PC_TYPES : ALL_TYPES),
      version: f.version || pick(r, VERSIONS),
      consentTime: fmt(lo + Math.floor(r() * Math.max(1, hi - lo))),
    });
  }
  return withId(rows, `s${hash(seed)}-`).sort(byTimeDesc);
}
