"use client";

import { useState } from "react";
import { loginAction } from "../actions";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await loginAction(formData);
      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch {
      // Redirect throws an error in Next.js Server Actions, so we catch it
      // or we just handle standard errors.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary-dark via-primary to-accent flex-col justify-center px-12 text-white">
        <div>
          <h1 className="text-5xl font-bold mb-6">Bem-vindo de volta!</h1>
          <p className="text-xl text-primary-light mb-8 leading-relaxed">
            Gerencie sua clínica de estética com eficiência. Acesso a agendamentos, clientes e relatórios em um único lugar.
          </p>
          <div className="flex gap-4 text-3xl">
            <span>✨</span>
            <span>📅</span>
            <span>👥</span>
            <span>📊</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 py-12 bg-white">
        <div className="w-full max-w-md mx-auto">
          {/* Logo e Título */}
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <div className="text-3xl">🌸</div>
              <span className="text-2xl font-bold text-primary-dark">BeautyFlow</span>
            </Link>
            <h2 className="text-3xl font-bold text-text-primary">Entrar</h2>
            <p className="text-text-muted mt-2">
              Use suas credenciais para acessar sua clínica
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Senha
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition"
              />
            </div>

            {/* Esqueci a senha */}
            <div className="flex justify-end">
              <Link
                href="#"
                className="text-sm text-primary-dark hover:text-primary font-medium"
              >
                Esqueci minha senha
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-danger-light border border-danger text-danger px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-dark text-white font-semibold py-3 rounded-lg hover:bg-primary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Entrando..." : "Entrar"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* Signup Link */}
          <p className="mt-8 text-center text-sm text-text-muted">
            Não tem conta?{" "}
            <Link href="/signup" className="font-semibold text-primary-dark hover:text-primary">
              Cadastre-se agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
