"use client";

import { useState } from "react";
import { Service } from "@/domain/service/Service";
import { createServiceAction, deleteServiceAction } from "./actions";
import { useToast } from "@/components/ui/Toast";

export default function ServiceList({ initialServices }: { initialServices: Service[] }) {
  const toast = useToast();
  const [services, setServices] = useState(initialServices);
  const [showAdd, setShowAdd] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this service?")) return;
    setLoadingId(id);
    const res = await deleteServiceAction(id);
    if (res.success) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.showToast("Service deleted successfully", "success");
    } else {
      toast.showToast("Failed to delete service", "error");
    }
    setLoadingId(null);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="card-header">
        <p className="text-sm font-medium text-gray-500">
          {services.length} {services.length === 1 ? "service" : "services"}
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
              Add Service
            </>
          )}
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="animate-slide-down border-b border-gray-100 bg-gray-50/30 p-6">
          <form
            action={async (formData) => {
              const res = await createServiceAction(formData);
              if (res.success && "data" in res) {
                setServices([...services, res.data as Service]);
                setShowAdd(false);
                toast.showToast("Service created successfully", "success");
              } else {
                toast.showToast(res.error || "Failed to create service", "error");
              }
            }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 items-end"
          >
            <div>
              <label className="form-label">Service Name</label>
              <input required name="name" type="text" className="form-input" placeholder="e.g. Laser Hair Removal" />
            </div>
            <div>
              <label className="form-label">Duration (minutes)</label>
              <input required name="duration" type="number" min="5" step="5" className="form-input" placeholder="e.g. 45" />
            </div>
            <div className="flex items-center h-full pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="requires_room" type="checkbox" value="true" className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                <span className="text-sm font-medium text-gray-700">Requires Room</span>
              </label>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-brand w-full sm:w-auto">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table / Empty */}
      {services.length === 0 ? (
        <div className="empty-state">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
          <p>No services found. Add your first service above!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Duration</th>
                <th>Room Required</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="group">
                  <td className="font-medium text-gray-900">{s.name}</td>
                  <td>
                    <span className="badge badge-violet">{s.duration} min</span>
                  </td>
                  <td>
                    {s.requires_room ? (
                      <span className="badge badge-pink">Required</span>
                    ) : (
                      <span className="badge badge-gray">No</span>
                    )}
                  </td>
                  <td className="text-right">
                    <button onClick={() => handleDelete(s.id)} disabled={loadingId === s.id} className="btn-danger-ghost">
                      {loadingId === s.id ? "Deleting..." : "Delete"}
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
