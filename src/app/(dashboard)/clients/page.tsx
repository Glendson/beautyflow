"use client";

import { useState, useEffect } from "react";
import { Card, Button, Input, Avatar, Table, TableHead, TableBody, TableRow, TableCell, TableHeader, Pagination } from "@/components/ui";
import { Plus, Search, Phone, Mail, Edit, Trash2 } from "lucide-react";
import { logger } from "@/lib/logger";
import { ClientModal, ClientFormData, DeleteConfirmationModal } from "@/components/modals";
import { listClientsAction, createClientAction, deleteClientAction } from "@/app/(auth)/actions";
import { Client } from "@/domain/client/Client";
import { PaginatedResult } from "@/lib/pagination";
import { useToast } from "@/components/ui/Toast";

export default function ClientsPage() {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [paginationData, setPaginationData] = useState<PaginatedResult<Client> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch clients
  const fetchClients = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const result = await listClientsAction(page, 10, {
        search: searchTerm || undefined,
      });

      if (result.success) {
        setClients(result.data.data);
        setPaginationData(result.data);
        setCurrentPage(page);
      }
    } catch (error) {
      logger.error("Erro ao buscar clientes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchClients(1);
  }, [searchTerm, fetchClients]);

  // Handle create client
  const handleCreateClient = () => {
    setModalMode("create");
    setSelectedClient(null);
    setModalOpen(true);
  };

  // Handle edit client
  const handleEditClient = (client: Client) => {
    setModalMode("edit");
    setSelectedClient(client);
    setModalOpen(true);
  };

  // Handle modal submit
  const handleModalSubmit = async (data: ClientFormData) => {
    try {
      setIsSubmitting(true);

      const result = await createClientAction({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
      });

      if (result.success) {
        setModalOpen(false);
        fetchClients(currentPage);
      } else {
        logger.error("Erro ao criar cliente:", result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete client
  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;

    try {
      setIsDeleting(true);
      const result = await deleteClientAction(clientToDelete.id);

      if (result.success) {
        setDeleteModalOpen(false);
        setClientToDelete(null);
        fetchClients(currentPage);
      } else {
        logger.error("Erro ao deletar cliente:", result.error);
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
          <h1 className="text-3xl font-bold text-neutral-900 mb-1">Clientes</h1>
          <p className="text-neutral-700">Gerencie sua base de clientes e histórico de agendamentos</p>
        </div>
        <Button
          leftIcon={<Plus className="w-5 h-5" />}
          size="lg"
          onClick={handleCreateClient}
        >
          Novo Cliente
        </Button>
      </div>

      {/* Search */}
      <Card padding="md">
        <Input
          label="Buscar cliente"
          placeholder="Digite nome ou email..."
          icon={<Search className="w-5 h-5" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      {/* Table */}
      <Card padding="none" elevation="sm">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-neutral-600">Carregando clientes...</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Cliente</TableHeader>
                  <TableHeader>Contato</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Telefone</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <p className="text-neutral-600">Nenhum cliente encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar initials={client.name} size="sm" />
                          <span className="font-semibold">{client.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                          <Mail className="w-4 h-4" />
                          {client.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {client.phone && (
                          <div className="flex items-center gap-2 text-sm text-neutral-700">
                            <Phone className="w-4 h-4" />
                            {client.phone}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClient(client)}
                            className="p-1.5 hover:bg-neutral-100 rounded transition"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4 text-neutral-700" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(client)}
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
                  onPageChange={fetchClients}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Client Modal */}
      <ClientModal
        open={modalOpen}
        mode={modalMode}
        title={modalMode === "create" ? "Novo Cliente" : "Editar Cliente"}
        isLoading={isSubmitting}
        onSubmit={handleModalSubmit}
        onCancel={() => setModalOpen(false)}
        initialData={
          selectedClient && modalMode === "edit"
            ? {
                name: selectedClient.name,
                email: selectedClient.email || "",
                phone: selectedClient.phone || "",
              }
            : undefined
        }
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        title="Deletar Cliente"
        message="Tem certeza que deseja deletar este cliente?"
        entityName={clientToDelete?.name}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}

