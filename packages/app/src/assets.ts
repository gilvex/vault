/** Keep stored mock paths portable across root hosting, Pages subpaths, and Tauri. */
export function assetUrl(path: string): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path
  const base = (import.meta as ImportMeta & { env: { BASE_URL: string } }).env.BASE_URL
  if (base !== '/' && path.startsWith(base)) return path
  return `${base}${path.replace(/^\/+/, '')}`
}
