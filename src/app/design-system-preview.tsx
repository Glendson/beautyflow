"use client";

/**
 * Design System Preview Page
 * Cores, tipografia e componentes base para BeautyFlow
 */

export default function DesignSystemPreview() {
  const colors = {
    primary: '#1E40AF',
    primaryLight: '#3B82F6',
    success: '#10B981',
    white: '#FFFFFF',
    lightGray: '#F8FAFC',
    darkGray: '#1E293B',
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: colors.lightGray, minHeight: '100vh', padding: '40px' }}>
      {/* HEADER */}
      <header style={{ marginBottom: '60px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: colors.darkGray, marginBottom: '10px' }}>
          🌸 BeautyFlow Design System
        </h1>
        <p style={{ fontSize: '16px', color: '#64748B' }}>
          Sistema de design para clínicas de estética
        </p>
      </header>

      {/* PALETA DE CORES */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.darkGray, marginBottom: '24px' }}>
          Paleta de Cores
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          {[
            { name: 'Azul Profissional', color: colors.primary, code: '#1E40AF' },
            { name: 'Azul Claro', color: colors.primaryLight, code: '#3B82F6' },
            { name: 'Verde', color: colors.success, code: '#10B981' },
            { name: 'Branco', color: colors.white, code: '#FFFFFF', border: true },
            { name: 'Cinza Claro', color: colors.lightGray, code: '#F8FAFC', border: true },
            { name: 'Cinza Escuro', color: colors.darkGray, code: '#1E293B' },
          ].map((col) => (
            <div key={col.code} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '100%',
                  height: '120px',
                  backgroundColor: col.color,
                  borderRadius: '8px',
                  marginBottom: '12px',
                  border: col.border ? '1px solid #e2e8f0' : 'none',
                }}
              />
              <p style={{ fontWeight: 'bold', color: colors.darkGray, marginBottom: '4px' }}>
                {col.name}
              </p>
              <code style={{ fontSize: '12px', color: '#64748B' }}>{col.code}</code>
            </div>
          ))}
        </div>
      </section>

      {/* TIPOGRAFIA */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.darkGray, marginBottom: '24px' }}>
          Tipografia
        </h2>
        <div style={{ backgroundColor: colors.white, padding: '24px', borderRadius: '8px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: colors.darkGray, marginBottom: '16px' }}>
            Título Grande (H1)
          </h1>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: colors.darkGray, marginBottom: '16px' }}>
            Título Médio (H2)
          </h2>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.darkGray, marginBottom: '16px' }}>
            Título Pequeno (H3)
          </h3>
          <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.5', marginBottom: '12px' }}>
            Corpo do texto regular - Inter regular 16px. Perfeito para descrições e conteúdo principal.
          </p>
          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '12px' }}>
            Texto pequeno - Inter regular 14px. Para informações secundárias.
          </p>
        </div>
      </section>

      {/* BOTÕES */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.darkGray, marginBottom: '24px' }}>
          Botões
        </h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', backgroundColor: colors.white, padding: '24px', borderRadius: '8px' }}>
          {/* Botão Primário */}
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
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryLight)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
          >
            Botão Primário
          </button>

          {/* Botão Secundário */}
          <button
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              color: colors.primary,
              backgroundColor: '#EFF6FF',
              border: `2px solid ${colors.primary}`,
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#DBEAFE')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#EFF6FF')}
          >
            Botão Secundário
          </button>

          {/* Botão de Sucesso */}
          <button
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              color: colors.white,
              backgroundColor: colors.success,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Sucesso
          </button>
        </div>
      </section>

      {/* INPUTS */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.darkGray, marginBottom: '24px' }}>
          Inputs
        </h2>
        <div style={{ backgroundColor: colors.white, padding: '24px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: colors.darkGray, marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: `1px solid #e2e8f0`,
                borderRadius: '6px',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: colors.darkGray, marginBottom: '8px' }}>
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: `1px solid #e2e8f0`,
                borderRadius: '6px',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.darkGray, marginBottom: '24px' }}>
          Cards
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { title: '📅 Agendamentos', description: 'Gerencie todos os agendamentos da sua clínica' },
            { title: '👥 Clientes', description: 'Base de dados completa com histórico de atendimentos' },
            { title: '📊 Relatórios', description: 'Analise faturamento, desempenho e tendências' },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                backgroundColor: colors.white,
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: colors.darkGray, marginBottom: '8px' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.5' }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BADGES */}
      <section>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.darkGray, marginBottom: '24px' }}>
          Badges de Status
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', backgroundColor: colors.white, padding: '24px', borderRadius: '8px' }}>
          {[
            { label: 'Agendado', color: colors.primaryLight },
            { label: 'Confirmado', color: colors.success },
            { label: 'Cancelado', color: '#EF4444' },
            { label: 'Concluído', color: '#8B5CF6' },
          ].map((badge) => (
            <span
              key={badge.label}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                color: colors.white,
                backgroundColor: badge.color,
                borderRadius: '4px',
              }}
            >
              {badge.label}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
