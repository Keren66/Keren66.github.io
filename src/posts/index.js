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

const modules = import.meta.glob('./*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const slug = path.replace(/^\.\/(.*)\.md$/, '$1')
    const { data, content } = parseFrontmatter(raw)
    return {
      slug,
      title: data.title || slug,
      date: data.date || '1970-01-01',
      excerpt: data.excerpt || '',
      content,
    }
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date))

export default posts
