import type { Lookup } from '@/components/StatusTag';

/** 回复状态（MYSANY.DEVICE_CLAIM_REPLY_STATE） */
export const REPLY_STATE: Lookup = {
  '0': { text: '未回复' },
  '1': { text: '已回复' },
};

/** 用户反馈结果（MYSANY.DEVICE_CLAIM_FEEDBACK） */
export const FEEDBACK: Lookup = {
  '0': { text: '未解决' },
  '1': { text: '已解决' },
};
