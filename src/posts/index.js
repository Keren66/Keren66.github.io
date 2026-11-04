function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([\w-]+):\s*(.*)$/)
    if (m) data[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
  }
  return { data, content: match[2] }
}

// 正文里与 frontmatter title 完全相同的 H1 一律丢掉——
// 标题已经由 BlogPost 页面的 <h1> 渲染，否则页面上会出现两遍同样的标题。
// 跳过 ``` 代码块，避免误删脚本里的注释行。
function stripDuplicateTitle(content, title) {
  const target = title.trim()
  let inFence = false
  return content
    .split(/\r?\n/)
    .filter((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence
        return true
      }
      if (inFence) return true
      const m = line.match(/^#\s+(.+?)\s*$/)
      return !(m && m[1].trim() === target)
    })
    .join('\n')
    .replace(/^\s*\n/, '')
}

const modules = import.meta.glob('./*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const slug = path.replace(/^\.\/(.*)\.md$/, '$1')
    const { data, content } = parseFrontmatter(raw)
    const title = data.title || slug
    return {
      slug,
      title,
      date: data.date || '1970-01-01',
      excerpt: data.excerpt || '',
      content: stripDuplicateTitle(content, title),
    }
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date))

export default posts
