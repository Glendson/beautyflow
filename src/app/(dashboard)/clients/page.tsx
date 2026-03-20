import { ClientUseCases } from "@/application/client/ClientUseCases";
import ClientList from "./ClientList";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const result = await ClientUseCases.getClients();
  const clients = result.success && result.data ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Clients</h1>
          <p className="mt-2 text-sm text-gray-500">Manage your clinic's patient records and contact information.</p>
        </div>
      </div>
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-2xl overflow-hidden">
        <ClientList initialClients={clients} />
      </div>
    </div>
  );
}
