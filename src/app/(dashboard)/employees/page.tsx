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
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Employees</h1>
        <p>Manage your staff and the services they provide.</p>
      </div>
      <div className="card">
        <EmployeeList initialEmployees={employees} availableServices={services} />
      </div>
    </div>
  );
}
