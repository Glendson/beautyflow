import { ClientUseCases } from "@/application/client/ClientUseCases";
import ClientList from "./ClientList";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const result = await ClientUseCases.getClients();
  const clients = result.success && result.data ? result.data : [];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Clients</h1>
        <p>Manage your clinic&apos;s patient records and contact information.</p>
      </div>
      <div className="card">
        <ClientList initialClients={clients} />
      </div>
    </div>
  );
}
