const contacts = [
  {
    label: 'Email',
    value: 'zkr1155124586@gmail.com',
    href: 'mailto:zkr1155124586@gmail.com',
  },
  {
    label: 'GitHub',
    value: '@Keren66',
    href: 'https://github.com/Keren66',
  },
  {
    label: 'Telegram',
    value: '@KerenHermes',
    href: 'https://t.me/KerenHermes',
  },
]

export default function Contact() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-2">Contact</h1>
      <p className="text-slate-600 mb-8">
        Feel free to reach out — I usually reply within 24 hours.
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
