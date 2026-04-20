import { Link } from 'react-router-dom'
import posts from '../posts'

export default function Blog() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-2">Blog</h1>
      <p className="text-slate-600 mb-8">Thoughts, notes, and occasional rants.</p>
      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={`/blog/${post.slug}`}
              className="block bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-300 transition"
            >
              <time className="text-xs text-slate-500">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <h2 className="text-xl font-semibold mt-1 mb-2">{post.title}</h2>
              <p className="text-slate-600 text-sm">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
