import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { FormInput } from '../forms';

export interface EmployeeFormData {
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
}

export interface EmployeeModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  title: string;
  isLoading?: boolean;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
  initialData?: Partial<EmployeeFormData>;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  open,
  mode,
  title,
  isLoading = false,
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    specialization: initialData?.specialization || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.phone && !/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Telefone deve ter 10-15 dígitos';
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
      <div className="space-y-4">
        <FormInput
          name="name"
          label="Nome"
          placeholder="Nome completo"
          value={formData.name}
          required
          error={errors.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
        />
        <FormInput
          name="email"
          label="Email"
          type="email"
          placeholder="email@example.com"
          value={formData.email}
          required
          error={errors.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
        />
        <FormInput
          name="phone"
          label="Telefone"
          type="tel"
          placeholder="(11) 99999-9999"
          value={formData.phone}
          error={errors.phone}
          onChange={(value) => setFormData({ ...formData, phone: value })}
        />
        <FormInput
          name="specialization"
          label="Especialização"
          placeholder="Ex: Esteticista, Dermatologista"
          value={formData.specialization}
          onChange={(value) =>
            setFormData({ ...formData, specialization: value })
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

export default EmployeeModal;
