"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui";
import { Bell, LogOut } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between h-20 px-6">
        {/* Left: Title/Breadcrumb */}
        <div className="hidden md:block">
          <h1 className="text-2xl font-bold text-slate-900">Seu Dashboard</h1>
          <p className="text-sm text-slate-500">Bem-vindo de volta! 👋</p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition"
            >
              <Avatar initials="JS" name="João Silva" size="md" />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-900">João Silva</p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>
            </button>

            {/* Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 p-2">
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded transition"
                >
                  Perfil e Configurações
                </Link>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition">
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
