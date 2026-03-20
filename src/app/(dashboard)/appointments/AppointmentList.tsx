"use client";

import { useState } from "react";
import { Appointment } from "@/domain/appointment/Appointment";
import { Client } from "@/domain/client/Client";
import { Service } from "@/domain/service/Service";
import { Employee } from "@/domain/employee/Employee";
import { Room } from "@/domain/room/Room";
import { createAppointmentAction, updateAppointmentStatusAction } from "./actions";

const STATUS_BADGES: Record<string, string> = {
  scheduled: "badge-blue",
  completed: "badge-green",
  canceled: "badge-red",
  no_show: "badge-amber",
};

export default function AppointmentList({
  initialAppointments,
  clients,
  services,
  employees,
  rooms,
}: {
  initialAppointments: Appointment[];
  clients: Client[];
  services: Service[];
  employees: Employee[];
  rooms: Room[];
}) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [showAdd, setShowAdd] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    setLoadingId(id);
    const res = (await updateAppointmentStatusAction(id, status)) as any;
    if (res.success && res.data) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? (res.data as Appointment) : a))
      );
    } else {
      alert("Failed to update status");
    }
    setLoadingId(null);
  };

  const getClientName = (id: string) =>
    clients.find((c) => c.id === id)?.name || "Unknown";
  const getServiceName = (id: string) =>
    services.find((s) => s.id === id)?.name || "Unknown";
  const getEmployeeName = (id: string) =>
    employees.find((e) => e.id === id)?.name || "Unknown";

  return (
    <div>
      {/* Toolbar */}
      <div className="card-header">
        <p className="text-sm font-medium text-gray-500">
          {appointments.length}{" "}
          {appointments.length === 1 ? "appointment" : "appointments"}
        </p>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-brand">
          {showAdd ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              Cancel
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Schedule Appointment
            </>
          )}
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="animate-slide-down border-b border-gray-100 bg-gray-50/30 p-6">
          <form
            action={async (formData) => {
              const res = (await createAppointmentAction(formData)) as any;
              if (res.success && res.data) {
                setAppointments(
                  [...appointments, res.data as Appointment].sort(
                    (a, b) =>
                      new Date(a.start_time).getTime() -
                      new Date(b.start_time).getTime()
                  )
                );
                setShowAdd(false);
              } else alert(res.error || "Failed");
            }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div>
              <label className="form-label">Client</label>
              <select required name="client_id" className="form-select">
                <option value="">Select a client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Service</label>
              <select required name="service_id" className="form-select">
                <option value="">Select a service...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.duration}m)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Provider</label>
              <select required name="employee_id" className="form-select">
                <option value="">Select a provider...</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Date</label>
              <input required name="date" type="date" className="form-input" />
            </div>

            <div>
              <label className="form-label">Time</label>
              <input required name="time" type="time" className="form-input" />
            </div>

            <div>
              <label className="form-label">Room (Optional)</label>
              <select name="room_id" className="form-select">
                <option value="">No specific room</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-1">
              <button type="submit" className="btn-brand">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table / Empty */}
      {appointments.length === 0 ? (
        <div className="empty-state">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          <p>No appointments scheduled. Book your first one above!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Client</th>
                <th>Service</th>
                <th>Provider</th>
                <th>Status</th>
                <th className="text-right">Update</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => {
                const sTime = new Date(a.start_time);
                const eTime = new Date(a.end_time);
                const dateFmt = sTime.toLocaleDateString();
                const timeFmt = `${sTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${eTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

                return (
                  <tr key={a.id} className="group">
                    <td>
                      <div className="font-medium text-gray-900">{dateFmt}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{timeFmt}</div>
                    </td>
                    <td className="font-medium text-gray-900">
                      {getClientName(a.client_id)}
                    </td>
                    <td>{getServiceName(a.service_id)}</td>
                    <td>{getEmployeeName(a.employee_id)}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGES[a.status] || "badge-gray"} capitalize`}>
                        {a.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="text-right">
                      <select
                        disabled={loadingId === a.id}
                        value={a.status}
                        onChange={(e) => handleStatusChange(a.id, e.target.value)}
                        className="form-select text-xs py-1.5 px-2 w-auto inline-block disabled:opacity-50"
                        style={{ minWidth: "120px" }}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="canceled">Canceled</option>
                        <option value="no_show">No Show</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
