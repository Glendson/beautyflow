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
  today.setHours(0,0,0,0);
  
  const upcomingAppointments = appointments.filter(a => new Date(a.start_time) >= today && a.status === 'scheduled');
  const todaysAppointments = upcomingAppointments.filter(a => {
    const d = new Date(a.start_time);
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500">Welcome back! Here's what's happening at your clinic today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 bg-gradient-to-r from-pink-50 to-violet-50 p-6 rounded-2xl border border-pink-100/50 shadow-sm">
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white">
          <h3 className="text-sm font-medium text-gray-500">Today's Appointments</h3>
          <p className="mt-2 text-4xl font-bold text-gray-900">{todaysAppointments.length}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white">
          <h3 className="text-sm font-medium text-gray-500">Upcoming Appointments</h3>
          <p className="mt-2 text-4xl font-bold text-gray-900">{upcomingAppointments.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <MetricCard title="Total Clients" value={clients.length} href="/clients" icon="👥" />
        <MetricCard title="Active Services" value={services.filter(s => s.is_active).length} href="/services" icon="✨" />
        <MetricCard title="Staff Members" value={employees.length} href="/employees" icon="🧑‍⚕️" />
      </div>
    </div>
  );
}

function MetricCard({ title, value, href, icon }: { title: string; value: number; href: string; icon: string }) {
  return (
    <Link href={href} className="bg-white overflow-hidden rounded-xl shadow-sm ring-1 ring-gray-900/5 hover:ring-pink-500/30 hover:shadow-md transition-all group p-6 block">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </Link>
  );
}
