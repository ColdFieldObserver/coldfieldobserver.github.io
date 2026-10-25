// ============================================================
// MDC AST 序列化
//   @nuxt/content 的 body 是 MDC（类 hast）树，服务端要输出 HTML（feed）
//   或纯文本（检索语料）时，用一个极小的序列化器即可，避免引入额外依赖。
// ============================================================

interface MdcNode {
  type?: string;
  tag?: string;
  value?: string;
  props?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
  children?: MdcNode[];
}

const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'source', 'area', 'base', 'col', 'embed']);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderAttrs(props: Record<string, unknown> | undefined): string {
  if (!props) return '';
  const parts: string[] = [];
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'className' || key === 'class') {
      const cls = Array.isArray(value) ? value.join(' ') : String(value);
      parts.push(`class="${escapeHtml(cls)}"`);
      continue;
    }
    if (key === 'style' && typeof value === 'object') {
      const css = Object.entries(value as Record<string, string>)
        .map(([k, v]) => `${k}:${v}`)
        .join(';');
      parts.push(`style="${escapeHtml(css)}"`);
      continue;
    }
    if (typeof value === 'object') continue;
    parts.push(`${key}="${escapeHtml(String(value))}"`);
  }
  return parts.length ? ` ${parts.join(' ')}` : '';
}

export function mdcToHtml(node: MdcNode | null | undefined): string {
  if (!node) return '';
  if (node.type === 'text') return escapeHtml(node.value ?? '');
  if (node.type === 'comment') return '';
  const children = (node.children ?? []).map((child) => mdcToHtml(child)).join('');
  if (node.type === 'root' || !node.tag) return children;
  const tag = node.tag;
  const attrs = renderAttrs(node.props ?? node.attributes);
  if (VOID_TAGS.has(tag)) return `<${tag}${attrs}>`;
  return `<${tag}${attrs}>${children}</${tag}>`;
}

/** 纯文本（用于本地检索语料）：块级元素之间补空格，避免词粘连 */
export function mdcToText(node: MdcNode | null | undefined): string {
  if (!node) return '';
  if (node.type === 'text') return node.value ?? '';
  const inner = (node.children ?? []).map((child) => mdcToText(child)).join('');
  return node.tag ? `${inner} ` : inner;
}
