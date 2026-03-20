import { EmployeeUseCases } from "@/application/employee/EmployeeUseCases";
import { ServiceUseCases } from "@/application/service/ServiceUseCases";
import EmployeeList from "./EmployeeList";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const [empResult, srvResult] = await Promise.all([
    EmployeeUseCases.getEmployees(),
    ServiceUseCases.getServices(),
  ]);

  const employees = empResult.success && empResult.data ? empResult.data : [];
  const services = srvResult.success && srvResult.data ? srvResult.data : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Employees</h1>
          <p className="mt-2 text-sm text-gray-500">Manage your staff and the services they provide.</p>
        </div>
      </div>
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-2xl overflow-hidden">
        <EmployeeList initialEmployees={employees} availableServices={services} />
      </div>
    </div>
  );
}
