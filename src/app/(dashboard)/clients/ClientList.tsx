"use client";

import { useState } from "react";
import { Client } from "@/domain/client/Client";
import { createClientAction, deleteClientAction } from "./actions";

export default function ClientList({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState(initialClients);
  const [showAdd, setShowAdd] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    setLoadingId(id);
    const res = await deleteClientAction(id);
    if (res.success) {
      setClients((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert("Failed to delete client");
    }
    setLoadingId(null);
  }

  return (
    <div>
      <div className="flex justify-end p-4 border-b border-gray-100 bg-gray-50/50">
        <button onClick={() => setShowAdd(!showAdd)} className="inline-flex items-center justify-center rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 transition-all active:scale-95">
          {showAdd ? "Cancel" : "+ Add Client"}
        </button>
      </div>

      {showAdd && (
        <div className="p-6 border-b border-gray-100 bg-pink-50/30">
          <form action={async (formData) => {
              const res = await createClientAction(formData);
              if (res.success && 'data' in res) {
                setClients([...clients, res.data as Client]);
                setShowAdd(false);
              } else alert((res as any).error || "Failed");
            }} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input required name="name" type="text" className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-pink-500 focus:ring-pink-500 sm:text-sm shadow-sm" placeholder="e.g. Jane Doe" />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-pink-500 focus:ring-pink-500 sm:text-sm shadow-sm" placeholder="optional" />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input name="phone" type="text" className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-pink-500 focus:ring-pink-500 sm:text-sm shadow-sm" placeholder="optional" />
            </div>
            <div className="sm:col-span-1 lg:col-span-3 flex justify-end">
              <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-gray-900 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-colors">
                Save Client
              </button>
            </div>
          </form>
        </div>
      )}

      {clients.length === 0 ? (
        <div className="p-12 text-center text-gray-500">No clients yet. Add your first patient above!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>{c.email || '-'}</div>
                    <div className="text-xs text-gray-400">{c.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(c.id)} disabled={loadingId === c.id} className="text-red-600 hover:text-red-900 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50">
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
