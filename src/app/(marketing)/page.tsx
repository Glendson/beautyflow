import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, Lock, Smartphone, DollarSign, MessageSquare, Rocket } from 'lucide-react';

export default function Homepage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl">🌸</div>
              <span className="text-2xl font-bold text-blue-900">BeautyFlow</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex gap-8 items-center">
              <a href="#features" className="text-slate-700 hover:text-slate-900 font-medium">
                Funcionalidades
              </a>
              <a href="#benefits" className="text-slate-700 hover:text-slate-900 font-medium">
                Preços
              </a>
              <Link href="/login" className="text-slate-700 hover:text-slate-900 font-medium">
                Login
              </Link>
            </nav>

            {/* CTA Button */}
            <Link
              href="/signup"
              className="hidden md:block px-6 py-2.5 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-50 to-white pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Gerencie sua clínica de estética com facilidade
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-lg">
                  BeautyFlow é a solução completa para gestão de agendamentos, clientes e serviços. Aumente sua eficiência e fature mais.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition gap-2"
                >
                  Começar grátis
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-blue-900 text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition">
                  Ver Demo
                </button>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-linear-to-br from-blue-900 to-blue-500 rounded-2xl opacity-10"></div>
              <div className="relative bg-linear-to-br from-blue-900 to-blue-500 h-80 rounded-2xl flex items-center justify-center shadow-2xl">
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-xl font-semibold">Dashboard Inteligente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 sm:py-24 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Funcionalidades principais
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar sua clínica em um único lugar
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📅',
                title: 'Agendamentos Inteligentes',
                description: 'Sistema de agendamento com notificações automáticas, lembretes e sincronização com calendário.',
              },
              {
                icon: '👥',
                title: 'Gestão de Clientes',
                description: 'Base de dados completa com histórico de atendimentos, preferências e dados de contato.',
              },
              {
                icon: '📊',
                title: 'Relatórios e Análises',
                description: 'Dashboard com métricas de faturamento, desempenho de funcionários e tendências.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-8 rounded-xl hover:shadow-lg transition-shadow duration-300 border border-slate-200"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="benefits" className="py-20 sm:py-24 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Por que escolher BeautyFlow?
            </h2>
          </div>

          {/* Benefit Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, text: 'Rápido e intuitivo' },
              { icon: Lock, text: 'Segurança de dados garantida' },
              { icon: Smartphone, text: 'Funciona em qualquer dispositivo' },
              { icon: DollarSign, text: 'Preços acessíveis' },
              { icon: MessageSquare, text: 'Suporte dedicado' },
              { icon: Rocket, text: 'Atualizações contínuas' },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border border-slate-200 flex items-center gap-4"
              >
                <benefit.icon className="w-8 h-8 text-blue-900 shrink-0" />
                <p className="font-semibold text-slate-900">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 sm:py-24 lg:py-28 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Pronto para transformar sua clínica?
          </h2>
          <p className="text-lg sm:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Comece agora e tenha 30 dias de teste grátis. Sem cartão de crédito necessário.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 font-bold rounded-lg hover:bg-slate-100 transition gap-2"
          >
            Começar grátis agora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">🌸</div>
                <span className="text-xl font-bold text-white">BeautyFlow</span>
              </div>
              <p className="text-sm text-slate-400">
                Sistema de gestão para clínicas de estética
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Funcionalidades</a></li>
                <li><a href="#benefits" className="hover:text-white transition">Preços</a></li>
                <li><a href="#" className="hover:text-white transition">Documentação</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition">Termos</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8">
            <p className="text-center text-sm text-slate-400">
              © 2026 BeautyFlow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
