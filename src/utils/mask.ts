/** PII 脱敏：列表与详情统一调用，避免两处不一致 */

/** 昵称：保留首字符，其余用 * 掩盖（CJK 按字，Latin 保留首尾） */
export function maskName(name: string): string {
  if (!name) return '';
  if (name.length <= 1) return name;
  if (/[一-龥]/.test(name)) return name[0] + '*'.repeat(name.length - 1);
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

/** 手机号：保留国家码 + 国家号码前 3 + 后 2，中间按位 * 掩盖，如 +86 138******78；≤5 位整段掩码。
 *  通用规则：可见位数恒为 5，与号码长度无关，避免短号（如新加坡 8 位）过度暴露。见 PRD §6.7。 */
export function maskPhone(phone: string): string {
  if (!phone) return '';
  const [cc = '', num = ''] = phone.split(' ');
  if (!num) return phone;
  const masked =
    num.length <= 5
      ? '*'.repeat(num.length)
      : `${num.slice(0, 3)}${'*'.repeat(num.length - 5)}${num.slice(-2)}`;
  return cc ? `${cc} ${masked}` : masked;
}

/** IP：保留前两段，后两段用 * 掩盖，如 113.87.***.*** */
export function maskIp(ip: string): string {
  if (!ip) return '';
  const parts = ip.split('.');
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.***.***`;
  return ip;
}
