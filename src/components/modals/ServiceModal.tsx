import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { FormInput, FormSelect, FormCheckbox, FormTextarea } from '../forms';

export interface ServiceFormData {
  name: string;
  description?: string;
  duration: number;
  price: number;
  categoryId: string;
  isActive: boolean;
}

export interface ServiceModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  title: string;
  isLoading?: boolean;
  onSubmit: (data: ServiceFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ServiceFormData>;
  categories: { value: string; label: string }[];
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  open,
  mode,
  title,
  isLoading = false,
  onSubmit,
  onCancel,
  initialData,
  categories,
}) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    duration: initialData?.duration || 60,
    price: initialData?.price || 0,
    categoryId: initialData?.categoryId || '',
    isActive: initialData?.isActive !== false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.duration < 15) {
      newErrors.duration = 'Duração mínima é 15 minutos';
    }

    if (formData.price < 0) {
      newErrors.price = 'Preço não pode ser negativo';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Categoria é obrigatória';
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
        <FormInput
          name="name"
          label="Nome do Serviço"
          placeholder="Ex: Limpeza de pele"
          value={formData.name}
          required
          error={errors.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
        />
        <FormSelect
          name="categoryId"
          label="Categoria"
          options={categories}
          value={formData.categoryId}
          placeholder="Selecione uma categoria"
          required
          error={errors.categoryId}
          onChange={(value) =>
            setFormData({ ...formData, categoryId: value })
          }
        />
        <FormTextarea
          name="description"
          label="Descrição"
          placeholder="Descrição do serviço"
          value={formData.description}
          maxLength={500}
          onChange={(value) =>
            setFormData({ ...formData, description: value })
          }
        />
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            name="duration"
            label="Duração (min)"
            type="number"
            value={formData.duration}
            min={15}
            required
            error={errors.duration}
            onChange={(value) =>
              setFormData({
                ...formData,
                duration: parseInt(value) || 60,
              })
            }
          />
          <FormInput
            name="price"
            label="Preço (R$)"
            type="number"
            value={formData.price}
            min={0}
            step="0.01"
            required
            error={errors.price}
            onChange={(value) =>
              setFormData({
                ...formData,
                price: parseFloat(value) || 0,
              })
            }
          />
        </div>
        <FormCheckbox
          name="isActive"
          label="Ativo"
          checked={formData.isActive}
          onChange={(checked) =>
            setFormData({ ...formData, isActive: checked })
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

export default ServiceModal;
