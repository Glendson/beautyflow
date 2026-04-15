"use client";

import { useState, useEffect } from "react";
import { Card, Button, Input, Badge, Table, TableHead, TableBody, TableRow, TableCell, TableHeader, Pagination } from "@/components/ui";
import { Plus, Search, Edit, Trash2, MapPin } from "lucide-react";import { logger } from "@/lib/logger";import { RoomModal, RoomFormData, DeleteConfirmationModal } from "@/components/modals";
import { listRoomsAction, createRoomAction, updateRoomAction, deleteRoomAction } from "@/app/(auth)/actions";
import { Room } from "@/domain/room/Room";
import { PaginatedResult } from "@/lib/pagination";

export default function RoomsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [paginationData, setPaginationData] = useState<PaginatedResult<Room> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRooms = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const result = await listRoomsAction(page, 10, {
        search: searchTerm || undefined,
      });

      if (result.success) {
        setRooms(result.data.data);
        setPaginationData(result.data);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Erro ao buscar ambientes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(1);
  }, [searchTerm]);

  const handleNewRoom = () => {
    setModalMode("create");
    setSelectedRoom(null);
    setModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setModalMode("edit");
    setSelectedRoom(room);
    setModalOpen(true);
  };

  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room);
    setDeleteModalOpen(true);
  };

  const handleModalSubmit = async (data: RoomFormData) => {
    try {
      setIsSubmitting(true);

      if (modalMode === "create") {
        const result = await createRoomAction(data);
        if (result.success) {
          setModalOpen(false);
          fetchRooms(currentPage);
        }
      } else if (selectedRoom) {
        const result = await updateRoomAction(selectedRoom.id, data);
        if (result.success) {
          setModalOpen(false);
          fetchRooms(currentPage);
        }
      }
    } catch (error) {
      console.error("Erro ao salvar ambiente:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!roomToDelete) return;

    try {
      setIsDeleting(true);
      const result = await deleteRoomAction(roomToDelete.id);

      if (result.success) {
        setDeleteModalOpen(false);
        setRoomToDelete(null);
        fetchRooms(currentPage);
      }
    } catch (error) {
      logger.error("Erro ao deletar ambiente:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchRooms(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Ambientes</h1>
          <p className="text-neutral-700">Gerencie seus ambientes e estações</p>
        </div>
        <Button onClick={handleNewRoom} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Ambiente
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b flex items-center gap-2">
          <Search className="w-5 h-5 text-neutral-500" />
          <Input
            placeholder="Buscar ambientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 focus:ring-0"
          />
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-neutral-600">Carregando...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>
                      <Badge variant={room.type === "room" ? "default" : "info"}>
                        {room.type === "room" ? "Sala" : "Estação"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRoom(room)}
                          className="text-primary hover:text-primary-dark"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(room)}
                          className="text-danger hover:text-danger-dark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {paginationData && (
              <div className="p-4 border-t">
                <Pagination
                  page={paginationData.page}
                  totalPages={paginationData.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </Card>

      <RoomModal
        open={modalOpen}
        mode={modalMode}
        title={modalMode === "create" ? "Novo Ambiente" : "Editar Ambiente"}
        initialData={
          selectedRoom && modalMode === "edit"
            ? {
                name: selectedRoom.name,
                type: selectedRoom.type,
              }
            : undefined
        }
        onSubmit={handleModalSubmit}
        isLoading={isSubmitting}
        onCancel={() => setModalOpen(false)}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        title="Deletar Ambiente"
        message={`Tem certeza que deseja deletar o ambiente "${roomToDelete?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setRoomToDelete(null);
        }}
        isLoading={isDeleting}
        isDangerous
      />
    </div>
  );
}
