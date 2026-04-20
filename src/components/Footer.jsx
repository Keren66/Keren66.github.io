export default function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-12">
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Keren Zhang. All rights reserved.</p>
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
            href="mailto:hello@example.com"
            className="hover:text-slate-900 transition"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}
