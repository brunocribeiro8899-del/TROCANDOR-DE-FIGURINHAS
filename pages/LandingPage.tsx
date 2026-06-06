import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <span className="font-bold text-gray-900">Trocando Figurinas</span>
          </div>
          <Link
            to="/login"
            className="px-5 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Copa do Mundo 2026
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Complete seu álbum{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              de figurinhas
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            A plataforma que conecta compradores e vendedores de figurinhas da Copa do Mundo.
            Encontre as figurinhas que faltam ou venda suas repetidas com facilidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cadastro"
              className="px-8 py-4 rounded-xl bg-green-600 text-white font-semibold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Criar conta grátis
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl bg-white text-gray-700 font-semibold text-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Já tenho conta
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mt-20 grid grid-cols-3 gap-8 text-center">
          {[
            { valor: '10.000+', label: 'Usuários ativos' },
            { valor: '50.000+', label: 'Figurinhas anunciadas' },
            { valor: '25.000+', label: 'Trocas realizadas' },
          ].map(({ valor, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-gray-900">{valor}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Como funciona</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { passo: '1', titulo: 'Cadastre-se', desc: 'Crie sua conta em segundos, escolha seu perfil e comece a negociar.' },
              { passo: '2', titulo: 'Publique ou Busque', desc: 'Anuncie suas figurinhas repetidas ou busque as que estão faltando no seu álbum.' },
              { passo: '3', titulo: 'Negocie', desc: 'Entre em contato com o vendedor e finalize sua negociação de forma segura.' },
            ].map(({ passo, titulo, desc }) => (
              <div key={passo} className="text-center p-6 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-card transition-all">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-blue-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {passo}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios por Perfil */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Para cada perfil, uma experiência única</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Comprador */}
            <div className="bg-white rounded-2xl p-8 border border-blue-100 shadow-card">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Para Compradores</h3>
              <p className="text-gray-500 mb-4">Complete seu álbum encontrando exatamente as figurinhas que faltam.</p>
              <ul className="space-y-2">
                {['Busca por nome, número ou seleção', 'Contato direto com vendedores', 'Acompanhe seus pedidos em tempo real', 'Avaliações de vendedores confiáveis'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-blue-500">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link to="/cadastro" className="mt-6 block text-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
                Sou comprador
              </Link>
            </div>

            {/* Vendedor */}
            <div className="bg-white rounded-2xl p-8 border border-green-100 shadow-card">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Para Vendedores</h3>
              <p className="text-gray-500 mb-4">Transforme suas figurinhas repetidas em renda extra ou troque por outras.</p>
              <ul className="space-y-2">
                {['Publique anúncios em segundos', 'Defina seu preço ou ofereça troca', 'Receba notificações de interesse', 'Gerencie todos os seus anúncios'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link to="/cadastro" className="mt-6 block text-center px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors">
                Sou vendedor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Pronto para completar seu álbum?
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Junte-se a milhares de colecionadores. Cadastre-se gratuitamente agora.
          </p>
          <Link
            to="/cadastro"
            className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            Criar conta grátis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">TF</span>
            </div>
            <span className="text-sm font-medium text-gray-600">Trocando Figurinas</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 Trocando Figurinas. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
