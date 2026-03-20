"use client";

import { useState } from "react";
import { Employee } from "@/domain/employee/Employee";
import { Service } from "@/domain/service/Service";
import { createEmployeeAction, deleteEmployeeAction } from "./actions";

export default function EmployeeList({ initialEmployees, availableServices }: { initialEmployees: Employee[], availableServices: Service[] }) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [showAdd, setShowAdd] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    setLoadingId(id);
    const res = await deleteEmployeeAction(id);
    if (res.success) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } else {
      alert("Failed to delete employee");
    }
    setLoadingId(null);
  };

  return (
    <div>
      <div className="flex justify-end p-4 border-b border-gray-100 bg-gray-50/50">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center justify-center rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 transition-all active:scale-95"
        >
          {showAdd ? "Cancel" : "+ Add Employee"}
        </button>
      </div>

      {showAdd && (
        <div className="p-6 border-b border-gray-100 bg-pink-50/30">
          <form
            action={async (formData) => {
              const res = await createEmployeeAction(formData);
              if (res.success && res.data) {
                setEmployees([...employees, res.data as Employee]);
                setShowAdd(false);
              } else {
                alert(res.error || "Failed");
              }
            }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-start"
          >
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input required name="name" type="text" className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-pink-500 focus:ring-pink-500 sm:text-sm shadow-sm" placeholder="e.g. Dr. Smith" />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-pink-500 focus:ring-pink-500 sm:text-sm shadow-sm" placeholder="optional" />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input name="phone" type="text" className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-pink-500 focus:ring-pink-500 sm:text-sm shadow-sm" placeholder="optional" />
            </div>
            
            <div className="sm:col-span-1 sm:row-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Can Perform Services</label>
              <div className="space-y-2 max-h-32 overflow-y-auto bg-white p-2 rounded-md border border-gray-300 shadow-sm">
                {availableServices.length === 0 && <span className="text-xs text-gray-400">No services exist</span>}
                {availableServices.map(s => (
                  <label key={s.id} className="flex items-center space-x-2">
                    <input type="checkbox" name="service_ids" value={s.id} className="rounded text-pink-600 focus:ring-pink-500" />
                    <span className="text-sm text-gray-700">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <input type="hidden" name="is_active" value="true" />
            <div className="sm:col-span-1 lg:col-span-3 flex justify-end">
              <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-gray-900 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-colors">
                Save Employee
              </button>
            </div>
          </form>
        </div>
      )}

      {employees.length === 0 ? (
        <div className="p-12 text-center text-gray-500">No employees yet. Add your first staff member above!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{e.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{e.email || '-'}</div>
                    <div className="text-xs text-gray-400">{e.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                    {e.service_ids?.length || 0} assigned
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(e.id)} 
                      disabled={loadingId === e.id}
                      className="text-red-600 hover:text-red-900 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      {loadingId === e.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
