import dayjs from 'dayjs';
import { delay, exact, fuzzy, inRange, paginate } from '@/mock/utils';
import { appealSeed, appealReplySeed, problemTypeSeed } from '@/mock/customer/appeal';
import { CURRENT_USER } from '@/config/app';
import type { ListFetcher } from '@/types/common';

/** 回复状态编码：0 未回复，1 已回复（MYSANY.DEVICE_CLAIM_REPLY_STATE） */
export type ReplyState = '0' | '1';
/** 用户反馈编码：0 未解决，1 已解决，空串表示用户尚未反馈（MYSANY.DEVICE_CLAIM_FEEDBACK） */
export type Feedback = '0' | '1' | '';

/** 错误类型 */
export interface ProblemType {
  typeCode: string;
  typeName: string;
}

/** 异常申诉 */
export interface Appeal {
  id: string;
  deviceNo: string;
  deviceName: string;
  /** 提交时间 */
  creationDate: string;
  /** 登录账号 */
  createdByName: string;
  problemType: string;
  problemTypeName: string;
  /** 设备经纬度 */
  devicePosition: string;
  /** 手机经纬度 */
  phonePosition: string;
  problemImageList: string[];
  problemDesc: string;
  /** 最近一次回复内容 */
  problemReply: string;
  replyState: ReplyState;
  feedback: Feedback;
}

/** 回复记录 */
export interface AppealReply {
  id: string;
  appealId: string;
  lastUpdateDate: string;
  replyName: string;
  problemReply: string;
  problemReplyImageList: string[];
  feedback: Feedback;
}

export interface AppealQuery {
  problemType?: string;
  replyState?: ReplyState;
  feedback?: '0' | '1';
  times?: unknown;
  /** 设备编码或名称 */
  paramKey?: string;
  createdByName?: string;
  [key: string]: unknown;
}

export interface ReplyPayload {
  id: string;
  problemReply: string;
  /** 回复图片地址 */
  problemReplyImage: string[];
}

const rows: Appeal[] = appealSeed.map((r) => ({ ...r }));
const replies: AppealReply[] = appealReplySeed.map((r) => ({ ...r }));

export async function fetchProblemTypes(): Promise<ProblemType[]> {
  await delay(100);
  return problemTypeSeed;
}

export const fetchAppealList: ListFetcher<Appeal, AppealQuery> = async (q) => {
  await delay();
  const list = rows
    .filter(
      (r) =>
        exact(r.problemType, q.problemType) &&
        exact(r.replyState, q.replyState) &&
        exact(r.feedback, q.feedback) &&
        inRange(r.creationDate, q.times) &&
        (fuzzy(r.deviceNo, q.paramKey) || fuzzy(r.deviceName, q.paramKey)) &&
        fuzzy(r.createdByName, q.createdByName),
    )
    .sort((a, b) => b.creationDate.localeCompare(a.creationDate));
  return paginate(list, q);
};

export async function fetchReplyRecords(appealId: string): Promise<AppealReply[]> {
  await delay(150);
  return replies
    .filter((r) => r.appealId === appealId)
    .sort((a, b) => b.lastUpdateDate.localeCompare(a.lastUpdateDate));
}

/** 提交回复：申诉变为已回复，用户反馈清空等待用户重新反馈 */
export async function submitReply({
  id,
  problemReply,
  problemReplyImage,
}: ReplyPayload): Promise<void> {
  await delay();
  const row = rows.find((r) => r.id === id);
  if (!row) throw new Error('申诉不存在');
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  row.replyState = '1';
  row.problemReply = problemReply;
  row.feedback = '';
  replies.push({
    id: `${id}-${replies.length + 1}`,
    appealId: id,
    lastUpdateDate: now,
    replyName: CURRENT_USER.name,
    problemReply,
    problemReplyImageList: problemReplyImage,
    feedback: '',
  });
}
