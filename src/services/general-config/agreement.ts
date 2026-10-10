import dayjs from 'dayjs';
import { delay, exact, fuzzy, inRange, paginate } from '@/mock/utils';
import {
  agreementLogSeed,
  agreementSeed,
  POPUP_EN_TEXT,
  POPUP_ZH_TEXT,
  PRIVACY_EN_HTML,
  PRIVACY_ZH_HTML,
  SERVICE_EN_HTML,
  SERVICE_ZH_HTML,
} from '@/mock/general-config/agreement';
import { LANGS, type LangCode } from '@/components/LangTabs/langs';
import type { ListFetcher } from '@/types/common';

/** 发布记录状态（值集 MYSANY.AGREEMENT_RELEASE_STATUS） */
export type AgreementStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'EXPIRED';
export type EffType = 'IMMEDIATE' | 'SCHEDULED';
/** 内容构成：P=隐私政策，S=用户服务协议，C=变更内容弹窗 */
export type ContentPart = 'P' | 'S' | 'C';
export type DocKind = 'privacy' | 'service';

/** 协议发布记录（列表行） */
export interface AgreementRelease {
  id: string;
  /** 发布编号 */
  version: string;
  sites: string[];
  /** 已填写的语言 */
  langs: LangCode[];
  has: ContentPart[];
  status: AgreementStatus;
  effType: EffType;
  effectiveTime: string;
  expireTime: string;
  /** 触达人数 */
  totalUser: number;
  /** 同意人数 */
  agreeUser: number;
  publisher: string;
  created: string;
}

/** 隐私政策 / 用户服务协议某一语言的内容 */
export interface AgreementDoc {
  title: string;
  version: string;
  /** 富文本 HTML */
  body: string;
  /** 最后编辑时间，空表示未编辑 */
  editedAt: string;
}

export interface PopupLang {
  title: string;
  /** 纯文本，可用 {{客服电话}} 占位 */
  body: string;
}

export interface AgreementContent {
  privacy: Record<LangCode, AgreementDoc>;
  service: Record<LangCode, AgreementDoc>;
  popup: { phone: string; langs: Record<LangCode, PopupLang> };
}

export interface AgreementLog {
  id: string;
  time: string;
  operator: string;
  action: string;
  remark: string;
}

/** 编辑视图表单 */
export interface AgreementForm {
  version: string;
  site: string;
  effType: EffType;
  /** YYYY-MM-DD HH:mm */
  effectiveTime: string;
  content: AgreementContent;
}

export interface AgreementDetail {
  release: AgreementRelease;
  form: AgreementForm;
  logs: AgreementLog[];
}

export interface AgreementQuery {
  version?: string;
  site?: string;
  status?: AgreementStatus;
  effectiveTime?: unknown;
  publisher?: string;
  [key: string]: unknown;
}

const CURRENT_USER = '刘伏旺';
/** 原型中「发布」未填生效时间时使用的默认生效时间 */
export const DEFAULT_EFFECTIVE_TIME = '2026-10-15 00:00';
const now = () => dayjs().format('YYYY-MM-DD HH:mm');

const DOC_TITLES: Record<DocKind, Record<LangCode, string>> = {
  privacy: {
    'zh-CN': '隐私政策',
    'en-US': 'MG Live Privacy Policy',
    'id-ID': 'Kebijakan Privasi MG Live',
    'zh-TW': 'MG Live 隱私權政策',
  },
  service: {
    'zh-CN': '用户服务协议',
    'en-US': 'MG Live User Service Agreement',
    'id-ID': 'Perjanjian Layanan Pengguna MG Live',
    'zh-TW': 'MG Live 用戶服務協議',
  },
};
const DOC_BODIES: Record<DocKind, Partial<Record<LangCode, string>>> = {
  privacy: { 'zh-CN': PRIVACY_ZH_HTML, 'en-US': PRIVACY_EN_HTML },
  service: { 'zh-CN': SERVICE_ZH_HTML, 'en-US': SERVICE_EN_HTML },
};
const POPUP_TITLES: Record<LangCode, string> = {
  'zh-CN': '更新提示',
  'en-US': 'Update Notice',
  'id-ID': 'Pemberitahuan Pembaruan',
  'zh-TW': '更新提示',
};
const POPUP_BODIES: Partial<Record<LangCode, string>> = {
  'zh-CN': POPUP_ZH_TEXT,
  'en-US': POPUP_EN_TEXT,
};

const byLang = <T>(fn: (code: LangCode) => T) =>
  Object.fromEntries(LANGS.map((l) => [l.code, fn(l.code)])) as Record<LangCode, T>;

/** 原型附录 A 的默认内容；原型中所有记录共用这一份，这里按记录各存一份 */
function defaultContent(version: string): AgreementContent {
  const doc = (kind: DocKind) =>
    byLang<AgreementDoc>((code) => ({
      title: DOC_TITLES[kind][code],
      version,
      body: DOC_BODIES[kind][code] ?? '',
      editedAt: code === 'zh-CN' ? '2026-09-29 18:02' : '',
    }));
  return {
    privacy: doc('privacy'),
    service: doc('service'),
    popup: {
      phone: '400-828-1088',
      langs: byLang((code) => ({ title: POPUP_TITLES[code], body: POPUP_BODIES[code] ?? '' })),
    },
  };
}

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

// ---- 内存数据 ----
const rows: AgreementRelease[] = clone(agreementSeed);
const contents = new Map<string, AgreementContent>(
  rows.map((r) => [r.id, defaultContent(r.version)]),
);
const logs = new Map<string, AgreementLog[]>(Object.entries(clone(agreementLogSeed)));
let seq = 100;

const find = (id: string) => {
  const row = rows.find((r) => r.id === id);
  if (!row) throw new Error('记录不存在');
  return row;
};
const addLog = (id: string, action: string, remark = '—') => {
  const list = logs.get(id) ?? [];
  list.push({
    id: `${id}-${Date.now()}-${list.length}`,
    time: now(),
    operator: CURRENT_USER,
    action,
    remark,
  });
  logs.set(id, list);
};

/**
 * 生成下一个发布编号。
 * 原型缺陷：按 `V{x.x}` 解析 `VS…` 编号恒得 NaN，新编号永远是 V0.1。
 * 这里按现有 VS 编号的数字部分取最大值 +1 递增。
 */
function nextVersion() {
  const max = rows.reduce((m, r) => {
    const n = Number(r.version.replace(/^VS/, ''));
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `VS${max + 1}`;
}

export const fetchAgreementList: ListFetcher<AgreementRelease, AgreementQuery> = async (q) => {
  await delay();
  // 原型缺陷：查询不按条件过滤。这里按全部条件过滤
  const list = rows.filter(
    (r) =>
      fuzzy(r.version, q.version) &&
      (!q.site || r.sites.includes(q.site)) &&
      exact(r.status, q.status) &&
      inRange(r.effectiveTime || undefined, q.effectiveTime) &&
      fuzzy(r.publisher, q.publisher),
  );
  return paginate(list, q);
};

export async function getAgreementDetail(id: string): Promise<AgreementDetail> {
  await delay(100);
  const release = find(id);
  return {
    release: { ...release },
    form: {
      version: release.version,
      site: release.sites[0] ?? '新加坡',
      effType: release.effType,
      effectiveTime: release.effectiveTime || DEFAULT_EFFECTIVE_TIME,
      content: clone(contents.get(id) ?? defaultContent(release.version)),
    },
    logs: [...(logs.get(id) ?? [])],
  };
}

/** 新建版本的初始表单：保留简体中文内容作为模板，其余语言正文清空（同原型） */
export async function getNewAgreementForm(): Promise<AgreementForm> {
  await delay(100);
  const version = nextVersion();
  const content = defaultContent(version);
  LANGS.forEach(({ code }) => {
    if (code === 'zh-CN') return;
    content.privacy[code].body = '';
    content.service[code].body = '';
    content.popup.langs[code].body = '';
  });
  return {
    version,
    site: '新加坡',
    effType: 'SCHEDULED',
    effectiveTime: DEFAULT_EFFECTIVE_TIME,
    content,
  };
}

/** 基于此版本新建：复制源记录全部内容，发布编号与文档版本号取新编号 */
export async function getCopyAgreementForm(sourceId: string): Promise<AgreementForm> {
  const { form } = await getAgreementDetail(sourceId);
  const version = nextVersion();
  (['privacy', 'service'] as const).forEach((k) =>
    LANGS.forEach(({ code }) => {
      form.content[k][code].version = version;
    }),
  );
  return { ...form, version, effType: 'SCHEDULED', effectiveTime: DEFAULT_EFFECTIVE_TIME };
}

const filledLangs = (c: AgreementContent) =>
  LANGS.map((l) => l.code).filter(
    (code) =>
      c.privacy[code].title.trim() ||
      c.privacy[code].body.trim() ||
      c.service[code].title.trim() ||
      c.service[code].body.trim(),
  );

/** 写入表单；id 为空时新建草稿记录（新建 / 基于此版本新建只在保存时才落库） */
function upsert(id: string | undefined, form: AgreementForm, remark: string) {
  let row: AgreementRelease;
  if (id) {
    row = find(id);
  } else {
    row = {
      id: String(++seq),
      version: form.version,
      sites: [form.site],
      langs: [],
      has: ['P', 'S', 'C'],
      status: 'DRAFT',
      effType: form.effType,
      effectiveTime: '',
      expireTime: '',
      totalUser: 0,
      agreeUser: 0,
      publisher: CURRENT_USER,
      created: now(),
    };
    rows.unshift(row);
    addLog(row.id, '创建草稿', remark);
  }
  Object.assign(row, {
    version: form.version,
    sites: [form.site],
    effType: form.effType,
    effectiveTime: form.effType === 'SCHEDULED' ? form.effectiveTime : row.effectiveTime,
    langs: filledLangs(form.content),
  });
  contents.set(row.id, clone(form.content));
  return row;
}

export async function saveAgreementDraft(
  id: string | undefined,
  form: AgreementForm,
  remark = '新建',
) {
  await delay();
  return { ...upsert(id, form, remark) };
}

/** 提交发布（已通过页面校验）。原型中立即生效同样进入「待生效」，生效时间取提交时刻 */
export async function submitAgreement(
  id: string | undefined,
  form: AgreementForm,
  remark = '新建',
) {
  await delay();
  const row = upsert(id, form, remark);
  row.status = 'SCHEDULED';
  row.langs = LANGS.map((l) => l.code);
  row.has = ['P', 'S', 'C'];
  row.effectiveTime = form.effType === 'IMMEDIATE' ? now() : form.effectiveTime;
  addLog(row.id, '提交发布', form.effType === 'IMMEDIATE' ? '立即生效' : '定时生效');
  return { ...row };
}

/** 列表「发布」：同原型，不校验直接进入待生效 */
export async function publishAgreement(id: string) {
  await delay();
  const row = find(id);
  row.status = 'SCHEDULED';
  row.effectiveTime = row.effectiveTime || DEFAULT_EFFECTIVE_TIME;
  addLog(id, '提交发布', '定时生效');
  return { ...row };
}

export async function cancelAgreement(id: string, reason: string) {
  await delay();
  find(id).status = 'DRAFT';
  addLog(id, '取消发布', reason);
}

export async function deleteAgreement(id: string) {
  await delay();
  const idx = rows.findIndex((r) => r.id === id && r.status === 'DRAFT');
  if (idx >= 0) rows.splice(idx, 1);
  contents.delete(id);
}
