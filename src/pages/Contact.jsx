const contacts = [
  {
    label: 'Email',
    value: 'hello@example.com',
    href: 'mailto:hello@example.com',
  },
  {
    label: 'GitHub',
    value: '@Keren66',
    href: 'https://github.com/Keren66',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/keren',
    href: 'https://www.linkedin.com/',
  },
]

export default function Contact() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-2">Contact</h1>
      <p className="text-slate-600 mb-8">
        The best ways to reach me. I try to reply within a few days.
      </p>
      <ul className="space-y-4">
        {contacts.map((c) => (
          <li key={c.label}>
            <a
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-md transition"
            >
              <span className="font-medium">{c.label}</span>
              <span className="text-slate-600 text-sm">{c.value}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
