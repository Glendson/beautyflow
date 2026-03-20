import { ServiceUseCases } from "@/application/service/ServiceUseCases";
import ServiceList from "./ServiceList";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const result = await ServiceUseCases.getServices();
  const services = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Services</h1>
          <p className="mt-2 text-sm text-gray-500">Manage the aesthetic treatments and services your clinic offers.</p>
        </div>
      </div>
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-2xl overflow-hidden">
        <ServiceList initialServices={services} />
      </div>
    </div>
  );
}
