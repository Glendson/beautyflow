"use client";

import { useState } from "react";
import { Room } from "@/domain/room/Room";
import { createRoomAction, deleteRoomAction } from "./actions";

export default function RoomList({ initialRooms }: { initialRooms: Room[] }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [showAdd, setShowAdd] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this room?")) return;
    setLoadingId(id);
    const res = await deleteRoomAction(id);
    if (res.success) setRooms((prev) => prev.filter((r) => r.id !== id));
    else alert("Failed to delete room");
    setLoadingId(null);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="card-header">
        <p className="text-sm font-medium text-gray-500">
          {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
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
              Add Room
            </>
          )}
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="animate-slide-down border-b border-gray-100 bg-gray-50/30 p-6">
          <form
            action={async (formData) => {
              const res = await createRoomAction(formData);
              if (res.success && "data" in res) {
                setRooms([...rooms, res.data as Room]);
                setShowAdd(false);
              } else alert((res as any).error || "Failed");
            }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-3 items-end"
          >
            <div>
              <label className="form-label">Room Name</label>
              <input required name="name" type="text" className="form-input" placeholder="e.g. Laser Room 1" />
            </div>
            <div>
              <label className="form-label">Type</label>
              <select name="type" className="form-select">
                <option value="room">Private Room</option>
                <option value="station">Open Station</option>
              </select>
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
      {rooms.length === 0 ? (
        <div className="empty-state">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
          </svg>
          <p>No rooms yet. Add your first room or station above!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Type</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id} className="group">
                  <td className="font-medium text-gray-900">{r.name}</td>
                  <td>
                    {r.type === "room" ? (
                      <span className="badge badge-violet">
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                        Private Room
                      </span>
                    ) : (
                      <span className="badge badge-blue">
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                        Open Station
                      </span>
                    )}
                  </td>
                  <td className="text-right">
                    <button onClick={() => handleDelete(r.id)} disabled={loadingId === r.id} className="btn-danger-ghost">
                      {loadingId === r.id ? "Deleting..." : "Delete"}
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
