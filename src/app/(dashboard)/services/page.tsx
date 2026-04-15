"use client";

import { useState, useEffect } from "react";
import { Card, Button, Input, Badge, Table, TableHead, TableBody, TableRow, TableCell, TableHeader, Pagination } from "@/components/ui";
import { Plus, Search, DollarSign, Edit, Trash2 } from "lucide-react";
import { ServiceModal, ServiceFormData, DeleteConfirmationModal } from "@/components/modals";
import { listServicesAction, createServiceAction, deleteServiceAction } from "@/app/(auth)/actions";
import { Service } from "@/domain/service/Service";
import { PaginatedResult } from "@/lib/pagination";

export default function ServicesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [paginationData, setPaginationData] = useState<PaginatedResult<Service> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchServices = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const result = await listServicesAction(page, 10, {
        search: searchTerm || undefined,
      });

      if (result.success) {
        setServices(result.data.data);
        setPaginationData(result.data);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(1);
  }, [searchTerm]);

  const handleCreateService = () => {
    setModalMode("create");
    setSelectedService(null);
    setModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setModalMode("edit");
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: ServiceFormData) => {
    try {
      setIsSubmitting(true);
      const result = await createServiceAction({
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
        category_id: data.categoryId,
        is_active: data.isActive,
      });

      if (result.success) {
        setModalOpen(false);
        fetchServices(currentPage);
      } else {
        console.error("Erro ao criar serviço:", result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      setIsDeleting(true);
      const result = await deleteServiceAction(serviceToDelete.id);

      if (result.success) {
        setDeleteModalOpen(false);
        setServiceToDelete(null);
        fetchServices(currentPage);
      } else {
        console.error("Erro ao deletar serviço:", result.error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-1">Serviços</h1>
          <p className="text-neutral-700">Gerencie o catálogo de serviços oferecidos</p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />} size="lg" onClick={handleCreateService}>
          Novo Serviço
        </Button>
      </div>

      <Card padding="md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Buscar serviço"
            placeholder="Digite o nome..."
            icon={<Search className="w-5 h-5" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">Categoria</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Todas as categorias</option>
            </select>
          </div>
        </div>
      </Card>

      <Card padding="none" elevation="sm">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-neutral-600">Carregando serviços...</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Serviço</TableHeader>
                  <TableHeader>Preço</TableHeader>
                  <TableHeader>Duração</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <p className="text-neutral-600">Nenhum serviço encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-semibold">{service.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-semibold">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-600">
                            {(service.price || 0).toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{service.duration} min</TableCell>
                      <TableCell>
                        <Badge variant={service.is_active ? "success" : "default"}>
                          {service.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditService(service)} className="p-1.5 hover:bg-neutral-100 rounded transition">
                            <Edit className="w-4 h-4 text-neutral-700" />
                          </button>
                          <button onClick={() => handleDeleteClick(service)} className="p-1.5 hover:bg-danger-light rounded transition">
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
                <Pagination page={paginationData.page} totalPages={paginationData.totalPages} onPageChange={fetchServices} />
              </div>
            )}
          </>
        )}
      </Card>

      <ServiceModal
        open={modalOpen}
        mode={modalMode}
        title={modalMode === "create" ? "Novo Serviço" : "Editar Serviço"}
        isLoading={isSubmitting}
        onSubmit={handleModalSubmit}
        onCancel={() => setModalOpen(false)}
        initialData={
          selectedService && modalMode === "edit"
            ? {
                name: selectedService.name,
                description: selectedService.description,
                duration: selectedService.duration,
                price: selectedService.price,
                categoryId: selectedService.category_id || undefined,
                isActive: selectedService.is_active,
              }
            : undefined
        }
        categories={[]}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        title="Deletar Serviço"
        message="Tem certeza que deseja deletar este serviço?"
        entityName={serviceToDelete?.name}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
