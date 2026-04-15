"use client";

import { useState, useEffect } from "react";
import { Card, Button, Input, Avatar, Badge, Table, TableHead, TableBody, TableRow, TableCell, TableHeader, Pagination } from "@/components/ui";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { EmployeeModal, EmployeeFormData, DeleteConfirmationModal } from "@/components/modals";
import { listEmployeesAction, createEmployeeAction, deleteEmployeeAction } from "@/app/(auth)/actions";
import { Employee } from "@/domain/employee/Employee";
import { PaginatedResult } from "@/lib/pagination";

export default function EmployeesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [paginationData, setPaginationData] = useState<PaginatedResult<Employee> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEmployees = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const result = await listEmployeesAction(page, 10, {
        search: searchTerm || undefined,
      });

      if (result.success) {
        setEmployees(result.data.data);
        setPaginationData(result.data);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Erro ao buscar profissionais:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(1);
  }, [searchTerm]);

  const handleCreateEmployee = () => {
    setModalMode("create");
    setSelectedEmployee(null);
    setModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setModalMode("edit");
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: EmployeeFormData) => {
    try {
      setIsSubmitting(true);
      const result = await createEmployeeAction(
        { name: data.name },
        undefined
      );

      if (result.success) {
        setModalOpen(false);
        fetchEmployees(currentPage);
      } else {
        logger.error("Erro ao criar profissional:", result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      setIsDeleting(true);
      const result = await deleteEmployeeAction(employeeToDelete.id);

      if (result.success) {
        setDeleteModalOpen(false);
        setEmployeeToDelete(null);
        fetchEmployees(currentPage);
      } else {
        logger.error("Erro ao deletar profissional:", result.error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-1">Equipe</h1>
          <p className="text-neutral-700">Gerencie profissionais e suas especialidades</p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />} size="lg" onClick={handleCreateEmployee}>
          Novo Profissional
        </Button>
      </div>

      <Card padding="md">
        <Input
          label="Buscar profissional"
          placeholder="Digite o nome..."
          icon={<Search className="w-5 h-5" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      <Card padding="none" elevation="sm">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-neutral-600">Carregando profissionais...</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Profissional</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Telefone</TableHeader>
                  <TableHeader>Especialização</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <p className="text-neutral-600">Nenhum profissional encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar initials={employee.name} size="sm" />
                          <span className="font-semibold">{employee.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-neutral-700">{employee.email || "-"}</TableCell>
                      <TableCell className="text-sm text-neutral-700">{employee.phone || "-"}</TableCell>
                      <TableCell className="text-sm text-neutral-700">{employee.specialty || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditEmployee(employee)} className="p-1.5 hover:bg-neutral-100 rounded transition">
                            <Edit className="w-4 h-4 text-neutral-700" />
                          </button>
                          <button onClick={() => handleDeleteClick(employee)} className="p-1.5 hover:bg-danger-light rounded transition">
                            <Trash2 className="w-4 h-4 text-danger" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {paginationData && paginationData.totalPages > 1 && (
              <div className="border-t border-neutral-200 p-4">
                <Pagination page={paginationData.page} totalPages={paginationData.totalPages} onPageChange={fetchEmployees} />
              </div>
            )}
          </>
        )}
      </Card>

      <EmployeeModal
        open={modalOpen}
        mode={modalMode}
        title={modalMode === "create" ? "Novo Profissional" : "Editar Profissional"}
        isLoading={isSubmitting}
        onSubmit={handleModalSubmit}
        onCancel={() => setModalOpen(false)}
        initialData={
          selectedEmployee && modalMode === "edit"
            ? {
                name: selectedEmployee.name,
                email: selectedEmployee.email || undefined,
                phone: selectedEmployee.phone || "",
                specialization: selectedEmployee.specialty || undefined,
              }
            : undefined
        }
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        title="Deletar Profissional"
        message="Tem certeza que deseja deletar este profissional?"
        entityName={employeeToDelete?.name}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
