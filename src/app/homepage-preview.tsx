/**
 * BeautyFlow Homepage
 * Landing page com hero, funcionalidades e CTA
 */

export default function Homepage() {
  const colors = {
    primary: '#1E40AF',
    primaryLight: '#3B82F6',
    success: '#10B981',
    white: '#FFFFFF',
    lightGray: '#F8FAFC',
    darkGray: '#1E293B',
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: colors.darkGray, backgroundColor: colors.white }}>
      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 40px',
          backgroundColor: colors.white,
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary }}>
          🌸 BeautyFlow
        </div>
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#" style={{ color: colors.darkGray, textDecoration: 'none', fontSize: '16px', cursor: 'pointer' }}>
            Funcionalidades
          </a>
          <a href="#" style={{ color: colors.darkGray, textDecoration: 'none', fontSize: '16px', cursor: 'pointer' }}>
            Preços
          </a>
          <a href="/login" style={{ color: colors.darkGray, textDecoration: 'none', fontSize: '16px', cursor: 'pointer' }}>
            Login
          </a>
        </nav>
        <button
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            color: colors.white,
            backgroundColor: colors.primary,
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Começar grátis
        </button>
      </header>

      {/* HERO SECTION */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          padding: '80px 40px',
          backgroundColor: `linear-gradient(135deg, ${colors.lightGray} 0%, ${colors.white} 100%)`,
          alignItems: 'center',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              lineHeight: '1.2',
              marginBottom: '20px',
              color: colors.darkGray,
            }}
          >
            Gerencie sua clínica de estética com facilidade
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: '#64748B',
              lineHeight: '1.6',
              marginBottom: '32px',
              maxWidth: '500px',
            }}
          >
            BeautyFlow é a solução completa para gestão de agendamentos, clientes e serviços. Aumente sua eficiência e fature mais.
          </p>
          <button
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              fontWeight: '600',
              color: colors.white,
              backgroundColor: colors.primary,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginRight: '16px',
            }}
          >
            Começar grátis
          </button>
          <button
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              fontWeight: '600',
              color: colors.primary,
              backgroundColor: 'transparent',
              border: `2px solid ${colors.primary}`,
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Ver Demo
          </button>
        </div>
        <div
          style={{
            backgroundColor: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
            height: '400px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.white,
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          Dashboard Mockup
        </div>
      </section>

      {/* FUNCIONALIDADES SECTION */}
      <section style={{ padding: '80px 40px', backgroundColor: colors.white }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: colors.darkGray,
            }}
          >
            Funcionalidades principais
          </h2>
          <p style={{ fontSize: '18px', color: '#64748B' }}>
            Tudo que você precisa para gerenciar sua clínica em um único lugar
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
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
          ].map((feature) => (
            <div
              key={feature.title}
              style={{
                backgroundColor: colors.lightGray,
                padding: '32px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  color: colors.darkGray,
                }}
              >
                {feature.title}
              </h3>
              <p style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFÍCIOS SECTION */}
      <section style={{ padding: '80px 40px', backgroundColor: colors.lightGray }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: colors.darkGray,
            }}
          >
            Por que escolher BeautyFlow?
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { icon: '⚡', text: 'Rápido e intuitivo' },
            { icon: '🔒', text: 'Segurança de dados garantida' },
            { icon: '📱', text: 'Funciona em qualquer dispositivo' },
            { icon: '💰', text: 'Preços acessíveis' },
            { icon: '🎯', text: 'Suporte dedicado' },
            { icon: '🚀', text: 'Atualizações contínuas' },
          ].map((benefit) => (
            <div
              key={benefit.text}
              style={{
                backgroundColor: colors.white,
                padding: '24px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div style={{ fontSize: '32px' }}>{benefit.icon}</div>
              <p style={{ fontSize: '16px', fontWeight: '500', color: colors.darkGray }}>
                {benefit.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        style={{
          padding: '80px 40px',
          backgroundColor: colors.primary,
          color: colors.white,
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '20px',
          }}
        >
          Pronto para transformar sua clínica?
        </h2>
        <p
          style={{
            fontSize: '18px',
            marginBottom: '32px',
            opacity: 0.9,
          }}
        >
          Comece agora e tenha 30 dias de teste grátis
        </p>
        <button
          style={{
            padding: '14px 40px',
            fontSize: '16px',
            fontWeight: '600',
            color: colors.primary,
            backgroundColor: colors.white,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Começar grátis agora
        </button>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: '40px',
          backgroundColor: colors.darkGray,
          color: colors.white,
          textAlign: 'center',
          borderTop: `1px solid #475569`,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '32px' }}>
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '12px' }}>BeautyFlow</h4>
            <p style={{ fontSize: '14px', color: '#cbd5e1' }}>
              Sistema de gestão para clínicas de estética
            </p>
          </div>
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Produto</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px' }}>
              <li><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Funcionalidades</a></li>
              <li><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Preços</a></li>
              <li><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Documentação</a></li>
            </ul>
          </div>
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Empresa</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px' }}>
              <li><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Sobre</a></li>
              <li><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Blog</a></li>
              <li><a href="#" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Contato</a></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #475569', paddingTop: '24px' }}>
          <p style={{ fontSize: '14px', color: '#cbd5e1' }}>
            © 2026 BeautyFlow. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
