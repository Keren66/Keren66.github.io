import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import posts from '../posts'

export default function BlogPost() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <section>
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link to="/blog" className="text-indigo-600 hover:underline">
          ← Back to blog
        </Link>
      </section>
    )
  }

  return (
    <article>
      <Link to="/blog" className="text-sm text-indigo-600 hover:underline">
        ← Back to blog
      </Link>
      <header className="mt-4 mb-8">
        <time className="text-sm text-slate-500">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <h1 className="text-4xl font-bold mt-1">{post.title}</h1>
      </header>
      <div className="prose prose-slate max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  )
}
