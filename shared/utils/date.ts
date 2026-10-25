/**
 * 日期工具（前后端共用）。
 *
 * frontmatter 里的日期写作 `2026-10-11 08:00:00`，YAML 1.2 不会把它解析成
 * Date，因此统一按「无时区的 UTC」解释：这样构建机时区不会让日期漂移一天。
 */

/** 解析 frontmatter 日期（支持 Date / 字符串 / 数字），失败返回 null */
export function parsePostDate(value: unknown): Date | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'number') {
    const fromNumber = new Date(value);
    return Number.isNaN(fromNumber.getTime()) ? null : fromNumber;
  }
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  // 已带时区（Z 或 ±hh:mm）就原样解析，否则补 Z 按 UTC 处理
  const normalized = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(raw)
    ? raw.replace(' ', 'T')
    : `${raw.replace(' ', 'T')}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** 毫秒时间戳（排序用），失败返回 0 */
export function timestampOf(value: unknown): number {
  return parsePostDate(value)?.getTime() ?? 0;
}

/** 格式化为 YYYY-MM-DD（按 UTC 取值，与 frontmatter 书写一致） */
export function formatDate(value: unknown): string {
  const date = parsePostDate(value);
  if (!date) return String(value ?? '');
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** 年份（归档用），失败返回空串 */
export function yearOf(value: unknown): string {
  const date = parsePostDate(value);
  return date ? String(date.getUTCFullYear()) : '';
}
