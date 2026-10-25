/**
 * 站内绝对路径补 baseURL。
 *
 * baseURL 目前是 '/'，但保留这层是为了将来迁到子路径部署时不用改所有调用点。
 * 必须在 setup / 事件回调里调用（内部读 useRuntimeConfig）。
 */
export function withBase(path: string): string {
  const base = useRuntimeConfig().app.baseURL || '/';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (base === '/') return normalized;
  return `${base.replace(/\/$/, '')}${normalized}`;
}
