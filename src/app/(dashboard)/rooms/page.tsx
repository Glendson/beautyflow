import { RoomUseCases } from "@/application/room/RoomUseCases";
import RoomList from "./RoomList";

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  const result = await RoomUseCases.getRooms();
  const rooms = result.success && result.data ? result.data : [];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Rooms &amp; Stations</h1>
        <p>Manage your clinic&apos;s physical spaces and equipment stations.</p>
      </div>
      <div className="card">
        <RoomList initialRooms={rooms} />
      </div>
    </div>
  );
}
