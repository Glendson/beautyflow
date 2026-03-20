import { ClientUseCases } from "@/application/client/ClientUseCases";
import { AppointmentUseCases } from "@/application/appointment/AppointmentUseCases";
import { EmployeeUseCases } from "@/application/employee/EmployeeUseCases";
import { ServiceUseCases } from "@/application/service/ServiceUseCases";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [aptRes, cliRes, srvRes, empRes] = await Promise.all([
    AppointmentUseCases.getAppointments(),
    ClientUseCases.getClients(),
    ServiceUseCases.getServices(),
    EmployeeUseCases.getEmployees(),
  ]);

  const appointments = aptRes.success && aptRes.data ? aptRes.data : [];
  const clients = cliRes.success && cliRes.data ? cliRes.data : [];
  const services = srvRes.success && srvRes.data ? srvRes.data : [];
  const employees = empRes.success && empRes.data ? empRes.data : [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.start_time) >= today && a.status === "scheduled"
  );
  const todaysAppointments = upcomingAppointments.filter((a) => {
    const d = new Date(a.start_time);
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1>{greeting} 👋</h1>
        <p>Here&apos;s what&apos;s happening at your clinic today.</p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 stagger-children">
        <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: "linear-gradient(135deg, #ec4899, #a855f7)" }}>
          <div className="relative z-10">
            <p className="text-sm font-medium text-white/80">Today&apos;s Appointments</p>
            <p className="mt-2 text-4xl font-bold">{todaysAppointments.length}</p>
            <p className="mt-1 text-sm text-white/70">
              {todaysAppointments.length === 0 ? "No appointments today" : `${todaysAppointments.length} scheduled for today`}
            </p>
          </div>
          <svg className="absolute right-4 bottom-4 w-24 h-24 text-white/10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
          <div className="relative z-10">
            <p className="text-sm font-medium text-white/80">Upcoming Appointments</p>
            <p className="mt-2 text-4xl font-bold">{upcomingAppointments.length}</p>
            <p className="mt-1 text-sm text-white/70">
              {upcomingAppointments.length === 0 ? "All caught up!" : `${upcomingAppointments.length} pending`}
            </p>
          </div>
          <svg className="absolute right-4 bottom-4 w-24 h-24 text-white/10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 stagger-children">
        <MetricCard
          title="Total Clients"
          value={clients.length}
          href="/clients"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          }
          color="#ec4899"
        />
        <MetricCard
          title="Active Services"
          value={services.filter((s) => s.is_active).length}
          href="/services"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
          }
          color="#8b5cf6"
        />
        <MetricCard
          title="Staff Members"
          value={employees.length}
          href="/employees"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          }
          color="#6366f1"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
          <QuickAction href="/appointments" label="Schedule Appointment" icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          } />
          <QuickAction href="/clients" label="Add New Client" icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
          } />
          <QuickAction href="/services" label="Manage Services" icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
            </svg>
          } />
          <QuickAction href="/employees" label="Staff Directory" icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
            </svg>
          } />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, href, icon, color }: { title: string; value: number; href: string; icon: React.ReactNode; color: string }) {
  return (
    <Link href={href} className="metric-card block group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}10`, color }}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        </div>
      </div>
    </Link>
  );
}

function QuickAction({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200/60 bg-white text-sm font-medium text-gray-700 hover:border-pink-200 hover:bg-pink-50/30 hover:text-pink-700 transition-all duration-150 group"
    >
      <span className="text-gray-400 group-hover:text-pink-500 transition-colors">{icon}</span>
      {label}
      <svg className="w-4 h-4 ml-auto text-gray-300 group-hover:text-pink-400 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  );
}
