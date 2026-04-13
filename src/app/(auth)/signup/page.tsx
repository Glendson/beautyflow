"use client";

import { useState } from "react";
import { signupAction } from "../actions";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await signupAction(formData);
      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch {
      // Redirects act as errors in Next.js
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-emerald-600 via-emerald-500 to-blue-600 flex-col justify-center px-12 text-white">
        <div>
          <h1 className="text-5xl font-bold mb-6">Comece agora!</h1>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Junte-se a centenas de clínicas usando BeautyFlow para gerenciar seus serviços e crescer seus negócios.
          </p>
          <div className="flex gap-4 text-3xl">
            <span>🚀</span>
            <span>⚡</span>
            <span>🎯</span>
            <span>💎</span>
          </div>
          <p className="text-emerald-100 mt-12 text-sm">30 dias de trial grátis. Sem cartão de crédito.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Logo e Título */}
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <div className="text-3xl">🌸</div>
              <span className="text-2xl font-bold text-blue-900">BeautyFlow</span>
            </Link>
            <h2 className="text-3xl font-bold text-slate-900">Criar Conta</h2>
            <p className="text-slate-600 mt-2">
              Configure sua clínica em minutos
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Clinic Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Nome da Clínica
              </label>
              <input
                name="clinicName"
                type="text"
                required
                placeholder="Clínica BeautyFlow"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition text-sm"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Seu Nome
              </label>
              <input
                name="firstName"
                type="text"
                required
                placeholder="João Silva"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Senha
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition text-sm"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? "Criando Conta..." : "Cadastrar"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-slate-600">
            Já tem conta?{" "}
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
