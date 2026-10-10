/** 字数：去掉所有空白后的字符数 */
export function countText(html: string) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent ?? '').replace(/\s/g, '').length;
}

/** 正文去掉标签后是否为空 */
export const isBlankHtml = (html: string) =>
  !html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
