import Link from "next/link";
import { logoutAction } from "../(auth)/actions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50/50">
      <aside className="w-64 bg-white border-r border-gray-200/60 shadow-sm flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              BeautyFlow
            </span>
          </div>
          <nav className="p-4 space-y-1">
            <NavItem href="/dashboard" label="Dashboard" icon="📊" />
            <NavItem href="/appointments" label="Appointments" icon="📅" />
            <NavItem href="/clients" label="Clients" icon="👥" />
            <NavItem href="/services" label="Services" icon="✨" />
            <NavItem href="/employees" label="Employees" icon="🧑‍⚕️" />
            <NavItem href="/rooms" label="Rooms" icon="🚪" />
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100">
          <form action={logoutAction}>
            <button type="submit" className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <span className="mr-3 text-lg leading-none">🚪</span> Logout
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link href={href} className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-pink-50 hover:text-pink-700 transition-all group">
      <span className="mr-3 text-lg leading-none opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
      {label}
    </Link>
  );
}
