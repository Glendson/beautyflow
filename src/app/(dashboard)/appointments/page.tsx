import { AppointmentUseCases } from "@/application/appointment/AppointmentUseCases";
import { ClientUseCases } from "@/application/client/ClientUseCases";
import { ServiceUseCases } from "@/application/service/ServiceUseCases";
import { EmployeeUseCases } from "@/application/employee/EmployeeUseCases";
import { RoomUseCases } from "@/application/room/RoomUseCases";
import AppointmentList from "./AppointmentList";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const [aptRes, cliRes, srvRes, empRes, rmRes] = await Promise.all([
    AppointmentUseCases.getAppointments(),
    ClientUseCases.getClients(),
    ServiceUseCases.getServices(),
    EmployeeUseCases.getEmployees(),
    RoomUseCases.getRooms(),
  ]);

  const appointments = aptRes.success && aptRes.data ? aptRes.data : [];
  const clients = cliRes.success && cliRes.data ? cliRes.data : [];
  const services = srvRes.success && srvRes.data ? srvRes.data : [];
  const employees = empRes.success && empRes.data ? empRes.data : [];
  const rooms = rmRes.success && rmRes.data ? rmRes.data : [];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Appointments</h1>
        <p>Schedule and manage clinic appointments.</p>
      </div>
      <div className="card">
        <AppointmentList
          initialAppointments={appointments}
          clients={clients}
          services={services}
          employees={employees}
          rooms={rooms}
        />
      </div>
    </div>
  );
}
