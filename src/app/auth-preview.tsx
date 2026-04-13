/**
 * Login/Signup Preview Page
 * Designs do formulário de autenticação
 */

export default function AuthPreview() {
  const colors = {
    primary: '#1E40AF',
    primaryLight: '#3B82F6',
    success: '#10B981',
    white: '#FFFFFF',
    lightGray: '#F8FAFC',
    darkGray: '#1E293B',
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: colors.lightGray, minHeight: '100vh', display: 'flex', gap: '40px', padding: '40px' }}>
      {/* LOGIN */}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.darkGray, marginBottom: '24px' }}>
          Página de Login
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', height: '500px' }}>
          {/* Left Side - Gradient */}
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.success} 100%)`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '40px',
              color: colors.white,
            }}
          >
            <h3 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>
              Bem-vindo de volta!
            </h3>
            <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
              Gerencie sua clínica de estética com eficiência
            </p>
            <div style={{ display: 'flex', gap: '8px', fontSize: '20px' }}>
              ✨ 📅 👥 📊
            </div>
          </div>

          {/* Right Side - Form */}
          <div
            style={{
              padding: '40px',
              backgroundColor: colors.white,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
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

            <div style={{ marginBottom: '20px' }}>
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

            <a href="#" style={{ fontSize: '14px', color: colors.primary, textDecoration: 'none', marginBottom: '20px' }}>
              Esqueci minha senha
            </a>

            <button
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                fontWeight: '600',
                color: colors.white,
                backgroundColor: colors.primary,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '12px',
              }}
            >
              Entrar
            </button>

            <p style={{ fontSize: '14px', color: '#64748B', textAlign: 'center' }}>
              Não tem conta? <a href="#" style={{ color: colors.primary, textDecoration: 'none', fontWeight: '600' }}>Cadastre-se</a>
            </p>
          </div>
        </div>
      </div>

      {/* SIGNUP */}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: colors.darkGray, marginBottom: '24px' }}>
          Página de Cadastro
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', height: '500px' }}>
          {/* Left Side - Gradient */}
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.primaryLight} 100%)`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '40px',
              color: colors.white,
            }}
          >
            <h3 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>
              Comece agora!
            </h3>
            <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
              Junte-se a centenas de clínicas usando BeautyFlow
            </p>
            <div style={{ display: 'flex', gap: '8px', fontSize: '20px' }}>
              🚀 ⚡ 🎯 💎
            </div>
          </div>

          {/* Right Side - Form */}
          <div
            style={{
              padding: '40px',
              backgroundColor: colors.white,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflowY: 'auto',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: colors.darkGray, marginBottom: '6px', fontSize: '14px' }}>
                Nome da Clínica
              </label>
              <input
                type="text"
                placeholder="Clínica BeautyFlow"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  border: `1px solid #e2e8f0`,
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: colors.darkGray, marginBottom: '6px', fontSize: '14px' }}>
                Nome
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  border: `1px solid #e2e8f0`,
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: colors.darkGray, marginBottom: '6px', fontSize: '14px' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  border: `1px solid #e2e8f0`,
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: colors.darkGray, marginBottom: '6px', fontSize: '14px' }}>
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  border: `1px solid #e2e8f0`,
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                fontWeight: '600',
                color: colors.white,
                backgroundColor: colors.success,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '10px',
                marginTop: '4px',
              }}
            >
              Cadastrar
            </button>

            <p style={{ fontSize: '12px', color: '#64748B', textAlign: 'center' }}>
              Já tem conta? <a href="#" style={{ color: colors.success, textDecoration: 'none', fontWeight: '600' }}>Entrar</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
