import { ServiceUseCases } from "@/application/service/ServiceUseCases";
import ServiceList from "./ServiceList";


export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const result = await ServiceUseCases.getServices();
  const services = result.success ? result.data : [];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Services</h1>
        <p>Manage the aesthetic treatments and services your clinic offers.</p>
      </div>
      <div className="card">
        <ServiceList initialServices={services} />
      </div>
    </div>
  );
}
