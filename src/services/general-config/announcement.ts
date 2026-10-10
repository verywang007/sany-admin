import dayjs from 'dayjs';
import { delay, exact, fuzzy, paginate } from '@/mock/utils';
import { announcementSeed, INTRANET_HTML } from '@/mock/general-config/announcement';
import { LANGS, type LangCode } from '@/components/LangTabs/langs';
import type { ListFetcher } from '@/types/common';

export type AnnouncementType = 'sys' | 'maint' | 'op';
/** 公告状态（与协议发布记录共用同一状态机） */
export type AnnouncementStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'EXPIRED';
export type EffType = 'IMMEDIATE' | 'SCHEDULED';

export const TOUCH_SYS = '系统通知';
export const TOUCHES = [TOUCH_SYS, '站内消息', '三一飞书'];

export interface Announcement {
  id: string;
  /** 公告编号 GG-yyyyMMdd-序号 */
  no: string;
  title: string;
  type: AnnouncementType;
  /** 触达方式 */
  touches: string[];
  /** 强制阅读 */
  force: boolean;
  /** 确认后不再弹出 */
  once: boolean;
  effType: EffType;
  /** 生效时间；立即生效发布的记录为「立即生效」 */
  eff: string;
  /** 失效时间；为空保存为「长期有效」 */
  exp: string;
  status: AnnouncementStatus;
  publisher: string;
  publishTime: string;
  /** 以下统计字段原型为预格式化文本 */
  read: string;
  reach: string;
  confirm: string;
  /** 正文 HTML，按语言维护 */
  content: Record<LangCode, string>;
  /** 系统通知弹窗的确认项文案 */
  confirmText?: string;
}

export type AnnouncementForm = Pick<
  Announcement,
  'title' | 'type' | 'touches' | 'force' | 'once' | 'effType' | 'eff' | 'exp' | 'content'
>;

export interface AnnouncementQuery {
  title?: string;
  type?: AnnouncementType;
  status?: AnnouncementStatus;
  publishTime?: unknown;
  [key: string]: unknown;
}

const CURRENT_USER = '产品顾问-刘伏旺';
const EMPTY_STATS = { read: '—', reach: '—', confirm: '—' };
const PUBLISHED_STATS = { read: '0%', reach: '0 / 1,562 人', confirm: '0 人已确认' };

const rows: Announcement[] = JSON.parse(JSON.stringify(announcementSeed)) as Announcement[];
let seq = 100;

const find = (id: string) => {
  const row = rows.find((r) => r.id === id);
  if (!row) throw new Error('公告不存在');
  return row;
};

/** 公告编号：GG-当天日期-序号；原型序号 = 总条数 + 1 可能重复，这里顺延到未使用的序号 */
export function genAnnouncementNo() {
  const prefix = `GG-${dayjs().format('YYYYMMDD')}-`;
  let n = rows.length + 1;
  while (rows.some((r) => r.no === prefix + String(n).padStart(3, '0'))) n++;
  return prefix + String(n).padStart(3, '0');
}

export const emptyContent = (): Record<LangCode, string> =>
  Object.fromEntries(LANGS.map((l) => [l.code, ''])) as Record<LangCode, string>;

/** 新建默认值（原型 resetForm） */
export const newAnnouncementForm = (): AnnouncementForm => ({
  title: '',
  type: 'sys',
  touches: [TOUCH_SYS],
  effType: 'SCHEDULED',
  eff: '2026-10-10 09:00',
  exp: '',
  force: true,
  once: true,
  content: { ...emptyContent(), 'zh-CN': INTRANET_HTML },
});

/** 发布时间区间匹配（按自然日，含两端）；未发布（「—」）的记录在有条件时不命中 */
function inPublishRange(value: string, range: unknown) {
  const r = range as [dayjs.Dayjs | null, dayjs.Dayjs | null] | undefined | null;
  if (!r || (!r[0] && !r[1])) return true;
  const v = dayjs(value);
  if (!v.isValid()) return false;
  return (!r[0] || !v.isBefore(r[0], 'day')) && (!r[1] || !v.isAfter(r[1], 'day'));
}

export const fetchAnnouncementList: ListFetcher<Announcement, AnnouncementQuery> = async (q) => {
  await delay();
  // 原型缺陷：「发布时间」为纯文本框且不参与过滤。这里改为日期范围并参与过滤
  const list = rows.filter(
    (r) =>
      fuzzy(r.title, q.title) &&
      exact(r.type, q.type) &&
      exact(r.status, q.status) &&
      inPublishRange(r.publishTime, q.publishTime),
  );
  return paginate(list, q);
};

export async function getAnnouncement(id: string): Promise<Announcement> {
  await delay(100);
  return JSON.parse(JSON.stringify(find(id))) as Announcement;
}

/** 写入表单；id 为空时生成新编号插到最前（新建 / 基于此公告新建） */
function upsert(id: string | undefined, form: AnnouncementForm) {
  const data = {
    ...form,
    eff: form.effType === 'SCHEDULED' ? form.eff : '立即生效',
    exp: form.exp.trim() || '长期有效',
    publisher: CURRENT_USER,
  };
  if (id) return Object.assign(find(id), data);
  const row: Announcement = {
    id: String(++seq),
    no: genAnnouncementNo(),
    status: 'DRAFT',
    publishTime: '—',
    ...EMPTY_STATS,
    ...data,
  };
  rows.unshift(row);
  return row;
}

/** 发布：定时生效 → 待生效；立即生效 → 已发布并初始化统计 */
function applyPublish(row: Announcement) {
  // 原型用 toLocaleString 生成「2026-10-9 10:02:33」，这里统一为 YYYY-MM-DD HH:mm
  row.publishTime = dayjs().format('YYYY-MM-DD HH:mm');
  if (row.effType === 'IMMEDIATE') Object.assign(row, { status: 'PUBLISHED', ...PUBLISHED_STATS });
  else Object.assign(row, { status: 'SCHEDULED', ...EMPTY_STATS });
  return { ...row };
}

export async function saveAnnouncementDraft(id: string | undefined, form: AnnouncementForm) {
  await delay();
  const row = upsert(id, form);
  Object.assign(row, { status: 'DRAFT', publishTime: '—', ...EMPTY_STATS });
  return { ...row };
}

export async function submitAnnouncement(id: string | undefined, form: AnnouncementForm) {
  await delay();
  return applyPublish(upsert(id, form));
}

/** 列表「发布」：同原型，不校验，按记录的生效方式流转 */
export async function publishAnnouncement(id: string) {
  await delay();
  return applyPublish(find(id));
}

export async function cancelAnnouncement(id: string, reason: string) {
  await delay();
  void reason; // 原型无操作日志，取消原因暂不落库
  Object.assign(find(id), { status: 'DRAFT', ...EMPTY_STATS });
}

export async function deleteAnnouncement(id: string) {
  await delay();
  const idx = rows.findIndex((r) => r.id === id && r.status === 'DRAFT');
  if (idx >= 0) rows.splice(idx, 1);
}

/** 模拟用户登录后应弹出的系统通知：已发布且触达方式含系统通知，强制阅读优先 */
export async function getLoginNotice(): Promise<Announcement | undefined> {
  await delay(100);
  const list = rows.filter((r) => r.status === 'PUBLISHED' && r.touches.includes(TOUCH_SYS));
  return list.find((r) => r.force) ?? list[0];
}
