"use client";

import { useState, useEffect } from "react";
import { Card, Button, Input, Badge, Table, TableHead, TableBody, TableRow, TableCell, TableHeader, Pagination } from "@/components/ui";
import { Plus, Search, Edit, Trash2, Calendar } from "lucide-react";
import { AppointmentModal, AppointmentFormData, DeleteConfirmationModal } from "@/components/modals";
import { listAppointmentsAction, createAppointmentAction, deleteAppointmentAction } from "@/app/(auth)/actions";
import { Appointment } from "@/domain/appointment/Appointment";
import { PaginatedResult } from "@/lib/pagination";

const statusConfig = {
  scheduled: { label: "Agendado", color: "primary" },
  completed: { label: "Concluído", color: "success" },
  canceled: { label: "Cancelado", color: "danger" },
  no_show: { label: "Não compareceu", color: "warning" },
};

export default function AppointmentsPage() {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [paginationData, setPaginationData] = useState<PaginatedResult<Appointment> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch appointments
  const fetchAppointments = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const result = await listAppointmentsAction(page, 10, {
        search: searchTerm || undefined,
        status: filterStatus || undefined,
      });

      if (result.success) {
        setAppointments(result.data.data);
        setPaginationData(result.data);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAppointments(1);
  }, [searchTerm, filterStatus]);

  // Handle create appointment
  const handleCreateAppointment = () => {
    setModalMode("create");
    setSelectedAppointment(null);
    setModalOpen(true);
  };

  // Handle edit appointment
  const handleEditAppointment = (appointment: Appointment) => {
    setModalMode("edit");
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  // Handle modal submit
  const handleModalSubmit = async (data: AppointmentFormData) => {
    try {
      setIsSubmitting(true);

      const result = await createAppointmentAction({
        client_id: data.clientId,
        service_id: data.serviceId,
        employee_id: data.employeeId,
        room_id: data.roomId || null,
        start_time: new Date(`${data.date.toISOString().split("T")[0]}T${data.startTime}`),
        end_time: new Date(`${data.date.toISOString().split("T")[0]}T${data.endTime}`),
      });

      if (result.success) {
        setModalOpen(false);
        fetchAppointments(currentPage);
      } else {
        logger.error("Erro ao criar agendamento:", result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete appointment
  const handleDeleteClick = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!appointmentToDelete) return;

    try {
      setIsDeleting(true);
      const result = await deleteAppointmentAction(appointmentToDelete.id);

      if (result.success) {
        setDeleteModalOpen(false);
        setAppointmentToDelete(null);
        fetchAppointments(currentPage);
      } else {
        logger.error("Erro ao deletar agendamento:", result.error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-1">Agendamentos</h1>
          <p className="text-neutral-700">Gerencie todos os agendamentos da clínica</p>
        </div>
        <Button
          leftIcon={<Plus className="w-5 h-5" />}
          size="lg"
          onClick={handleCreateAppointment}
        >
          Novo Agendamento
        </Button>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Buscar por cliente ou serviço"
            placeholder="Digite o nome..."
            icon={<Search className="w-5 h-5" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Todos os status</option>
              <option value="scheduled">Agendado</option>
              <option value="completed">Concluído</option>
              <option value="canceled">Cancelado</option>
              <option value="no_show">Não compareceu</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none" elevation="sm">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-neutral-600">Carregando agendamentos...</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Cliente</TableHeader>
                  <TableHeader>Serviço</TableHeader>
                  <TableHeader>Data & Hora</TableHeader>
                  <TableHeader>Profissional</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <p className="text-neutral-600">Nenhum agendamento encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-semibold">{apt.client_id}</TableCell>
                      <TableCell>{apt.service_id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-neutral-700">
                          <Calendar className="w-4 h-4" />
                          {new Date(apt.start_time).toLocaleDateString("pt-BR")} às{" "}
                          {new Date(apt.start_time).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </TableCell>
                      <TableCell>{apt.employee_id}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            statusConfig[apt.status as keyof typeof statusConfig]
                              ?.color as "primary" | "success" | "danger" | "warning" | "info" | "default"
                          }
                        >
                          {statusConfig[apt.status as keyof typeof statusConfig]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditAppointment(apt)}
                            className="p-1.5 hover:bg-neutral-100 rounded transition"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4 text-neutral-700" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(apt)}
                            className="p-1.5 hover:bg-danger-light rounded transition"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4 text-danger" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {paginationData && paginationData.totalPages > 1 && (
              <div className="border-t border-neutral-200 p-4">
                <Pagination
                  page={paginationData.page}
                  totalPages={paginationData.totalPages}
                  onPageChange={fetchAppointments}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Appointment Modal */}
      <AppointmentModal
        open={modalOpen}
        mode={modalMode}
        title={modalMode === "create" ? "Novo Agendamento" : "Editar Agendamento"}
        isLoading={isSubmitting}
        onSubmit={handleModalSubmit}
        onCancel={() => setModalOpen(false)}
        initialData={
          selectedAppointment && modalMode === "edit"
            ? {
                clientId: selectedAppointment.client_id,
                serviceId: selectedAppointment.service_id,
                employeeId: selectedAppointment.employee_id,
                roomId: selectedAppointment.room_id || undefined,
                date: new Date(selectedAppointment.start_time),
                startTime: new Date(selectedAppointment.start_time)
                  .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                  .replace(/:/g, ":"),
                endTime: new Date(selectedAppointment.end_time)
                  .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                  .replace(/:/g, ":"),
              }
            : undefined
        }
        clients={[]}
        services={[]}
        employees={[]}
        rooms={[]}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        title="Deletar Agendamento"
        message="Tem certeza que deseja deletar este agendamento?"
        entityName={
          appointmentToDelete
            ? `${appointmentToDelete.client_id} - ${appointmentToDelete.service_id}`
            : ""
        }
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}

