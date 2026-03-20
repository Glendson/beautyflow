"use client";

import { useState } from "react";
import { Room } from "@/domain/room/Room";
import { createRoomAction, deleteRoomAction } from "./actions";

export default function RoomList({ initialRooms }: { initialRooms: Room[] }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [showAdd, setShowAdd] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    setLoadingId(id);
    const res = await deleteRoomAction(id);
    if (res.success) {
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert("Failed to delete room");
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
          {showAdd ? "Cancel" : "+ Add Room"}
        </button>
      </div>

      {showAdd && (
        <div className="p-6 border-b border-gray-100 bg-pink-50/30">
          <form
            action={async (formData) => {
              const res = await createRoomAction(formData);
              if (res.success && res.data) {
                setRooms([...rooms, res.data as Room]);
                setShowAdd(false);
              } else {
                alert(res.error || "Failed");
              }
            }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-3 items-end"
          >
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input required name="name" type="text" className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-pink-500 focus:ring-pink-500 sm:text-sm shadow-sm" placeholder="e.g. Laser Room 1" />
            </div>
            
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-pink-500 focus:ring-pink-500 sm:text-sm shadow-sm">
                <option value="room">Private Room</option>
                <option value="station">Open Station</option>
              </select>
            </div>

            <input type="hidden" name="is_active" value="true" />
            <div className="sm:col-span-1 flex justify-end">
              <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent bg-gray-900 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-colors">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {rooms.length === 0 ? (
        <div className="p-12 text-center text-gray-500">No rooms yet. Add your first room or station above!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {r.type === 'room' ? '🚪 Private Room' : '🪑 Open Station'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(r.id)} 
                      disabled={loadingId === r.id}
                      className="text-red-600 hover:text-red-900 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
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
