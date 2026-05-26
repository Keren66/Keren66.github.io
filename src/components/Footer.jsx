export default function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-12">
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Keren Zhang. Built with React + Vite.</p>
        <div className="flex gap-4">
          <a
            href="https://github.com/Keren66"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900 transition"
          >
            GitHub
          </a>
          <a
            href="mailto:zkr1155124586@gmail.com"
            className="hover:text-slate-900 transition"
          >
            Email
          </a>
          <a
            href="https://t.me/KerenHermes"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900 transition"
          >
            Telegram
          </a>
        </div>
      </div>
    </footer>
  )
}
