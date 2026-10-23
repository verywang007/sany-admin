import type { PrivacyAuthFilters } from '@/services/customer/privacyAuth';
import { lookupText } from '@/utils/lookup';
import { SCENE } from './constants';

/** 结果提示条中的条件描述，文案与原型一致 */
export function describeFilters(f: PrivacyAuthFilters) {
  const p: string[] = [];
  if (f.customerId) p.push(`客户ID 含「${f.customerId}」`);
  if (f.alias) p.push(`昵称 含「${f.alias}」`);
  if (f.phone) p.push(`手机号 含「${f.phone}」`);
  if (f.terminal) p.push(`终端 = ${f.terminal}`);
  if (f.consentType) p.push(`同意类型 = ${f.consentType}`);
  if (f.scene) p.push(`授权场景 = ${lookupText(SCENE, f.scene)}`);
  if (f.version) p.push(`版本号 含「${f.version}」`);
  if (f.start || f.end) p.push(`同意时间 ${f.start || '不限'} ~ ${f.end || '不限'}`);
  return p.length ? `（条件：${p.join('；')}）` : '（未设置筛选条件，返回全部记录）';
}
