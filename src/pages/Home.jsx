import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="flex flex-col items-center text-center gap-6 py-12">
      <img
        src="/avatar.png"
        alt="avatar"
        className="w-40 h-40 object-contain drop-shadow-lg"
      />
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Hi, I'm <span className="text-indigo-600">Keren</span>.
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
          Welcome to my corner of the internet. I build things with code and
          write occasionally about what I learn.
        </p>
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          to="/projects"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          View Projects
        </Link>
        <Link
          to="/contact"
          className="px-5 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition"
        >
          Get in Touch
        </Link>
      </div>
    </section>
  )
}
