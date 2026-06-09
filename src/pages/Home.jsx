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
          Hi, I'm <span className="text-indigo-600">Keren Zhang</span>
        </h1>
        <p className="mt-2 text-indigo-500 font-medium text-sm">AWS APN 解决方案架构师</p>
        <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          专注于 AWS 云架构设计、生成式 AI 与企业级迁移现代化。
          <br />
          用代码和架构解决真实世界的问题。
        </p>
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          to="/projects"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          项目作品
        </Link>
        <Link
          to="/blog"
          className="px-5 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition"
        >
          博客文章
        </Link>
        <a
          href="https://github.com/Keren66"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition"
        >
          GitHub
        </a>
      </div>
      <a
        href="/aws-scs-c03-bilingual.html"
        className="mt-6 block w-full max-w-md mx-auto p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl hover:shadow-md hover:border-amber-400 transition text-center"
      >
        <span className="text-lg">📚 AWS SCS-C03 安全专项刷题</span>
        <span className="block text-sm text-slate-600 mt-1">325题中英双语 · 亮色/暗色主题 · 自动评分</span>
      </a>
      <a
        href="/blog/web3-exchange-security-architecture"
        className="block w-full max-w-md mx-auto p-4 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-xl hover:shadow-md hover:border-sky-400 transition text-center"
      >
        <span className="text-lg">📊 Web3交易所安全架构白皮书</span>
        <span className="block text-sm text-slate-600 mt-1">23层防御 · OWASP全映射 · VARA合规 · 附完整Excel报价清单</span>
      </a>
    </section>
  )
}
