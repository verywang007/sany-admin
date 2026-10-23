import type { Dayjs } from 'dayjs';
import { delay, paginate } from '@/mock/utils';
import { privacyAuthPool, synthesize, type SynthesizeFilters } from '@/mock/customer/privacyAuth';
import type { ListFetcher } from '@/types/common';

/** 隐私授权记录 */
export interface PrivacyAuthRecord {
  id: string;
  /** 客户ID，8 位数字字符串 */
  customerId: string;
  alias: string;
  /** 手机号，格式「+区号 号码」 */
  phone: string;
  /** APP / PC */
  terminal: string;
  consentType: string;
  version: string;
  /** 同意时间 YYYY-MM-DD HH:mm:ss（客户端上报） */
  consentTime: string;
  /*
   * 以下为授权来源（PRD §6.4），来源采集上线前的历史记录均为空串。
   * 推断：原型无这些字段，按 PRD Q8 的结论补充。
   */
  /** 授权场景编码，值集见页面 constants.ts 的 SCENE */
  scene: string;
  /** 客户端版本：APP 为版本号，PC 为 Web 前端版本 */
  clientVersion: string;
  /** 用户看到的协议语言，LangCode */
  lang: string;
  /** 设备型号（APP）或浏览器（PC） */
  device: string;
  os: string;
  /** 完整 IP，页面上脱敏展示，导出给全量 */
  ip: string;
  ipRegion: string;
  /** 设备 ID 的 SHA-256，不存明文 */
  deviceIdHash: string;
  /** 用户同意时协议正文的 SHA-256；权限类授权为空 */
  contentHash: string;
  /** 服务端接收时间，客户端时间可被篡改，举证以此为准 */
  serverTime: string;
}

export interface PrivacyAuthQuery {
  customerId?: string;
  alias?: string;
  phone?: string;
  terminal?: string;
  consentType?: string;
  version?: string;
  scene?: string;
  /** 时间区间（仅日期），可只填一端 */
  time?: [Dayjs | null, Dayjs | null] | null;
  [key: string]: unknown;
}

export type PrivacyAuthFilters = SynthesizeFilters;

/** 读取筛选条件：文本 trim；下拉为空或「全部」视为不限；日期取 YYYY-MM-DD */
export function normalizeFilters(q: PrivacyAuthQuery): PrivacyAuthFilters {
  const txt = (v: unknown) => String(v ?? '').trim();
  const sel = (v: unknown) => {
    const s = txt(v);
    return s === '全部' ? '' : s;
  };
  return {
    customerId: txt(q.customerId),
    alias: txt(q.alias),
    phone: txt(q.phone),
    terminal: sel(q.terminal),
    consentType: sel(q.consentType),
    version: txt(q.version),
    scene: sel(q.scene),
    start: q.time?.[0]?.format('YYYY-MM-DD') ?? '',
    end: q.time?.[1]?.format('YYYY-MM-DD') ?? '',
  };
}

const norm = (x: string) => x.replace(/\s/g, '').toLowerCase();

/** 过滤规则：客户ID 原样子串包含；昵称/手机号/版本号去空白、忽略大小写包含；终端/类型/场景精确；日期按日含两端 */
function match(row: PrivacyAuthRecord, f: PrivacyAuthFilters) {
  if (f.customerId && !row.customerId.includes(f.customerId)) return false;
  if (f.alias && !norm(row.alias).includes(norm(f.alias))) return false;
  if (f.phone && !norm(row.phone).includes(norm(f.phone))) return false;
  if (f.terminal && row.terminal !== f.terminal) return false;
  if (f.consentType && row.consentType !== f.consentType) return false;
  if (f.version && !norm(row.version).includes(norm(f.version))) return false;
  if (f.scene && row.scene !== f.scene) return false;
  const d = row.consentTime.slice(0, 10);
  if (f.start && d < f.start) return false;
  if (f.end && d > f.end) return false;
  return true;
}

export const fetchPrivacyAuthList: ListFetcher<PrivacyAuthRecord, PrivacyAuthQuery> = async (q) => {
  await delay();
  const f = normalizeFilters(q);
  let list = privacyAuthPool.filter((r) => match(r, f));
  const hasIdentity = !!(f.customerId || f.alias || f.phone || f.version);
  if (!list.length && hasIdentity) list = synthesize(f);
  return paginate(list, q);
};
