"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  Users,
  Scissors,
  Users2,
  DoorOpen,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/dashboard/appointments", label: "Agendamentos", icon: Calendar },
  { href: "/dashboard/clients", label: "Clientes", icon: Users },
  { href: "/dashboard/services", label: "Serviços", icon: Scissors },
  { href: "/dashboard/employees", label: "Funcionários", icon: Users2 },
  { href: "/dashboard/rooms", label: "Salas", icon: DoorOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-white
          transform transition-transform duration-200 z-40
          lg:transform-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 px-6 py-8 border-b border-slate-700 hover:bg-slate-800 transition"
          >
            <div className="text-3xl">🌸</div>
            <div>
              <div className="font-bold text-xl">BeautyFlow</div>
              <div className="text-xs text-slate-400">Gestão de Clínica</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-colors duration-200
                    ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-slate-700 p-4 space-y-2">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg
                text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Configurações</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
