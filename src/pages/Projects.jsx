import projects from '../data/projects'

export default function Projects() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-2">Projects</h1>
      <p className="text-slate-600 mb-8">
        A selection of things I've built. Click through to see the code.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((p) => (
          <a
            key={p.title}
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className="block bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-300 transition"
          >
            <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
            <p className="text-slate-600 text-sm mb-4">{p.description}</p>
            <div className="flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md"
                >
                  {t}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
