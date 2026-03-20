"use client";

import { useState } from "react";
import { Appointment } from "@/domain/appointment/Appointment";
import { Client } from "@/domain/client/Client";
import { Service } from "@/domain/service/Service";
import { Employee } from "@/domain/employee/Employee";
import { Room } from "@/domain/room/Room";
import { createAppointmentAction, updateAppointmentStatusAction } from "./actions";

export default function AppointmentList({ 
  initialAppointments, clients, services, employees, rooms 
}: { 
  initialAppointments: Appointment[], clients: Client[], services: Service[], employees: Employee[], rooms: Room[] 
}) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [showAdd, setShowAdd] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    setLoadingId(id);
    const res = await updateAppointmentStatusAction(id, status);
    if (res.success && res.data) {
      setAppointments(prev => prev.map(a => a.id === id ? (res.data as Appointment) : a));
    } else {
      alert("Failed to update status");
    }
    setLoadingId(null);
  };

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || "Unknown";
  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || "Unknown";
  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || "Unknown";
  
  return (
    <div>
      <div className="flex justify-end p-4 border-b border-gray-100 bg-gray-50/50">
        <button onClick={() => setShowAdd(!showAdd)} className="inline-flex items-center justify-center rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 transition-all active:scale-95">
          {showAdd ? "Cancel" : "+ Schedule Appointment"}
        </button>
      </div>

      {showAdd && (
        <div className="p-6 border-b border-gray-100 bg-pink-50/30">
          <form action={async (formData) => {
              const res = await createAppointmentAction(formData);
              if (res.success && res.data) {
                setAppointments([...appointments, res.data as Appointment].sort((a,b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()));
                setShowAdd(false);
              } else alert(res.error || "Failed");
            }} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select required name="client_id" className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-pink-500 focus:ring-pink-500 sm:text-sm shadow-sm">
                <option value="">Select a client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
              <select required name="service_id" className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-pink-500 focus:ring-pink-500 sm:text-sm shadow-sm">
                <option value="">Select a service...</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.duration_minutes}m)</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider (Employee)</label>
              <select required name="employee_id" className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-pink-500 focus:ring-pink-500 sm:text-sm shadow-sm">
                <option value="">Select a provider...</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input required name="date" type="date" className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-pink-500 focus:ring-pink-500 sm:text-sm shadow-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input required name="time" type="time" className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-pink-500 focus:ring-pink-500 sm:text-sm shadow-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room (Optional)</label>
              <select name="room_id" className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-pink-500 focus:ring-pink-500 sm:text-sm shadow-sm">
                <option value="">No specific room</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.type})</option>)}
              </select>
            </div>
            
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end mt-2">
              <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-gray-900 py-2 px-8 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-colors">
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="p-12 text-center text-gray-500">No appointments scheduled. Book your first one above!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Update Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((a) => {
                const sTime = new Date(a.start_time);
                const eTime = new Date(a.end_time);
                const dateFmt = sTime.toLocaleDateString();
                const timeFmt = `${sTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${eTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                
                return (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{dateFmt}</div>
                    <div className="text-gray-500 text-xs mt-1">{timeFmt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getClientName(a.client_id)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getServiceName(a.service_id)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getEmployeeName(a.employee_id)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${a.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                        a.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'}`
                    }>
                      {a.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <select 
                      disabled={loadingId === a.id}
                      value={a.status}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                      className="rounded border-gray-300 text-xs shadow-sm focus:border-pink-500 focus:ring-pink-500 disabled:opacity-50"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="canceled">Canceled</option>
                      <option value="no_show">No Show</option>
                    </select>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
