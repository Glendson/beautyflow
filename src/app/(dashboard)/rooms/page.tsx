import { RoomUseCases } from "@/application/room/RoomUseCases";
import RoomList from "./RoomList";

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  const result = await RoomUseCases.getRooms();
  const rooms = result.success && result.data ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Rooms & Stations</h1>
          <p className="mt-2 text-sm text-gray-500">Manage your clinic physical spaces and equipment stations.</p>
        </div>
      </div>
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-2xl overflow-hidden">
        <RoomList initialRooms={rooms} />
      </div>
    </div>
  );
}
