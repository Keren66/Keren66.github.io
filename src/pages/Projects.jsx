import projects from '../data/projects'

export default function Projects() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-2">Projects</h1>
      <p className="text-slate-600 mb-8">
        A selection of things I've built.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((p) => (
          <div
            key={p.title}
            className="block bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-300 transition"
          >
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-xl font-semibold">{p.title}</h2>
              {p.date && (
                <span className="text-xs text-slate-400 whitespace-nowrap ml-2 mt-1">{p.date}</span>
              )}
            </div>
            <p className="text-slate-600 text-sm mb-4">{p.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                GitHub →
              </a>
              {p.demo && (
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                >
                  在线体验 →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
