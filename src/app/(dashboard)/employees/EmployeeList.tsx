"use client";

import { useState } from "react";
import { Employee } from "@/domain/employee/Employee";
import { Service } from "@/domain/service/Service";
import { createEmployeeAction, deleteEmployeeAction } from "./actions";
import { useToast } from "@/components/ui/Toast";

export default function EmployeeList({
  initialEmployees,
  availableServices,
}: {
  initialEmployees: Employee[];
  availableServices: Service[];
}) {
  const toast = useToast();
  const [employees, setEmployees] = useState(initialEmployees);
  const [showAdd, setShowAdd] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    if (confirmingId === id) {
      performDelete(id);
    } else {
      setConfirmingId(id);
    }
  };

  const performDelete = async (id: string) => {
    setLoadingId(id);
    const res = await deleteEmployeeAction(id);
    if (res.success) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      toast.showToast("Employee removed successfully", "success");
    } else {
      toast.showToast("Failed to delete employee", "error");
    }
    setLoadingId(null);
    setConfirmingId(null);
  };

  const cancelDelete = () => {
    setConfirmingId(null);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="card-header">
        <p className="text-sm font-medium text-gray-500">
          {employees.length} {employees.length === 1 ? "employee" : "employees"}
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
              Add Employee
            </>
          )}
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="animate-slide-down border-b border-gray-100 bg-gray-50/30 p-6">
          <form
            action={async (formData) => {
              const selectedSvcs = Array.from(formData.getAll("services") as string[]);
              formData.set("service_ids", selectedSvcs.join(","));
              const res = await createEmployeeAction(formData);
              if (res.success && "data" in res) {
                setEmployees([...employees, res.data as Employee]);
                setShowAdd(false);
                toast.showToast("Employee created successfully", "success");
              } else {
                toast.showToast(res.error || "Failed to create employee", "error");
              }
            }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 items-start"
          >
            <div>
              <label className="form-label">Full Name</label>
              <input required name="name" type="text" className="form-input" placeholder="e.g. Sarah Smith" />
            </div>

            <div className="sm:col-span-1 lg:col-span-2">
              <label className="form-label">Performed Services</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-white border border-gray-200 rounded-lg">
                {availableServices.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                    <input type="checkbox" name="services" value={s.id} className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                    <span className="truncate">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-1">
              <button type="submit" className="btn-brand">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Save Employee
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table / Empty */}
      {employees.length === 0 ? (
        <div className="empty-state">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <p>No staff members found. Add your first employee above!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Employee</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}>
                        {e.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{e.name}</span>
                    </div>
                  </td>
                  <td className="text-right space-x-2">
                    {confirmingId === e.id ? (
                      <>
                        <button onClick={() => performDelete(e.id)} disabled={loadingId === e.id} className="btn-danger">
                          {loadingId === e.id ? "Deleting..." : "Confirm"}
                        </button>
                        <button onClick={cancelDelete} disabled={loadingId === e.id} className="btn-secondary">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleDeleteClick(e.id)} disabled={loadingId === e.id} className="btn-danger-ghost">
                        Delete
                      </button>
                    )}
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
