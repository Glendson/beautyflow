import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { FormInput, FormDatePicker, FormTimePicker, FormSelect, FormTextarea } from '../forms';

export interface AppointmentFormData {
  clientId: string;
  serviceId: string;
  employeeId: string;
  roomId?: string;
  date: Date;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface AppointmentModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  title: string;
  isLoading?: boolean;
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  initialData?: Partial<AppointmentFormData>;
  clients: { value: string; label: string }[];
  services: { value: string; label: string }[];
  employees: { value: string; label: string }[];
  rooms: { value: string; label: string }[];
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  open,
  mode,
  title,
  isLoading = false,
  onSubmit,
  onCancel,
  initialData,
  clients,
  services,
  employees,
  rooms,
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    clientId: initialData?.clientId || '',
    serviceId: initialData?.serviceId || '',
    employeeId: initialData?.employeeId || '',
    roomId: initialData?.roomId || '',
    date: initialData?.date || new Date(),
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) newErrors.clientId = 'Cliente é obrigatório';
    if (!formData.serviceId) newErrors.serviceId = 'Serviço é obrigatório';
    if (!formData.employeeId) newErrors.employeeId = 'Profissional é obrigatório';
    if (!formData.startTime) newErrors.startTime = 'Horário de início é obrigatório';
    if (!formData.endTime) newErrors.endTime = 'Horário de fim é obrigatório';
    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = 'Horário de fim deve ser após o início';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <FormSelect
          name="clientId"
          label="Cliente"
          options={clients}
          value={formData.clientId}
          placeholder="Selecione um cliente"
          required
          error={errors.clientId}
          onChange={(value) =>
            setFormData({ ...formData, clientId: value })
          }
        />
        <FormSelect
          name="serviceId"
          label="Serviço"
          options={services}
          value={formData.serviceId}
          placeholder="Selecione um serviço"
          required
          error={errors.serviceId}
          onChange={(value) =>
            setFormData({ ...formData, serviceId: value })
          }
        />
        <FormSelect
          name="employeeId"
          label="Profissional"
          options={employees}
          value={formData.employeeId}
          placeholder="Selecione um profissional"
          required
          error={errors.employeeId}
          onChange={(value) =>
            setFormData({ ...formData, employeeId: value })
          }
        />
        <FormSelect
          name="roomId"
          label="Sala/Estação"
          options={rooms}
          value={formData.roomId || ''}
          placeholder="Opcional - Selecione uma sala"
          onChange={(value) =>
            setFormData({ ...formData, roomId: value })
          }
        />
        <FormDatePicker
          name="date"
          label="Data"
          value={formData.date}
          minDate={new Date()}
          required
          onChange={(date) => setFormData({ ...formData, date })}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormTimePicker
            name="startTime"
            label="Início"
            value={formData.startTime}
            required
            error={errors.startTime}
            onChange={(time) =>
              setFormData({ ...formData, startTime: time })
            }
          />
          <FormTimePicker
            name="endTime"
            label="Fim"
            value={formData.endTime}
            required
            error={errors.endTime}
            onChange={(time) =>
              setFormData({ ...formData, endTime: time })
            }
          />
        </div>
        <FormTextarea
          name="notes"
          label="Observações"
          placeholder="Notas adicionais sobre o atendimento"
          value={formData.notes}
          maxLength={500}
          onChange={(value) =>
            setFormData({ ...formData, notes: value })
          }
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Salvando...' : mode === 'create' ? 'Criar' : 'Atualizar'}
        </button>
      </div>
    </Modal>
  );
};

export default AppointmentModal;
