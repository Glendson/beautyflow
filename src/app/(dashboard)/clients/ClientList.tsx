"use client";

import { useState } from "react";
import { Client } from "@/domain/client/Client";
import { createClientAction, deleteClientAction } from "./actions";
import { useToast } from "@/components/ui/Toast";

export default function ClientList({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState(initialClients);
  const [showAdd, setShowAdd] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this client?")) return;
    setLoadingId(id);
    const res = await deleteClientAction(id);
    if (res.success) {
      setClients((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert("Failed to delete client");
    }
    setLoadingId(null);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="card-header">
        <p className="text-sm font-medium text-gray-500">
          {clients.length} {clients.length === 1 ? "client" : "clients"}
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
              Add Client
            </>
          )}
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="animate-slide-down border-b border-gray-100 bg-gray-50/30 p-6">
          <form
            action={async (formData) => {
              const res = await createClientAction(formData);
              if (res.success && "data" in res) {
                setClients([...clients, res.data as Client]);
                setShowAdd(false);
                toast.showToast("Client created successfully", "success");
              } else {
                toast.showToast(res.error || "Failed to create client", "error");
              }
            }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-3"
          >
            <div>
              <label className="form-label">Full Name</label>
              <input required name="name" type="text" className="form-input" placeholder="e.g. Jane Doe" />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input name="email" type="email" className="form-input" placeholder="optional" />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input name="phone" type="text" className="form-input" placeholder="optional" />
            </div>
            <div className="sm:col-span-3 flex justify-end pt-1">
              <button type="submit" className="btn-brand">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Save Client
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table / Empty */}
      {clients.length === 0 ? (
        <div className="empty-state">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          <p>No clients yet. Add your first patient above!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="group">
                  <td className="font-medium text-gray-900">{c.name}</td>
                  <td>{c.email || <span className="text-gray-300">—</span>}</td>
                  <td>{c.phone || <span className="text-gray-300">—</span>}</td>
                  <td className="text-right">
                    <button onClick={() => handleDelete(c.id)} disabled={loadingId === c.id} className="btn-danger-ghost">
                      {loadingId === c.id ? "Deleting..." : "Delete"}
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
