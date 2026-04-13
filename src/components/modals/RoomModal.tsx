import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { FormInput, FormSelect, FormCheckbox } from '../forms';

export interface RoomFormData {
  name: string;
  type: 'room' | 'station';
  location?: string;
  isActive: boolean;
}

export interface RoomModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  title: string;
  isLoading?: boolean;
  onSubmit: (data: RoomFormData) => void;
  onCancel: () => void;
  initialData?: Partial<RoomFormData>;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  open,
  mode,
  title,
  isLoading = false,
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<RoomFormData>({
    name: initialData?.name || '',
    type: initialData?.type || 'room',
    location: initialData?.location || '',
    isActive: initialData?.isActive !== false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
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
          label="Nome da Sala/Estação"
          placeholder="Ex: Sala A, Laser 01"
          value={formData.name}
          required
          error={errors.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
        />
        <FormSelect
          name="type"
          label="Tipo"
          options={[
            { value: 'room', label: 'Sala' },
            { value: 'station', label: 'Estação' },
          ]}
          value={formData.type}
          required
          onChange={(value) =>
            setFormData({
              ...formData,
              type: value as 'room' | 'station',
            })
          }
        />
        <FormInput
          name="location"
          label="Localização"
          placeholder="Ex: Andar 2, Bloco A"
          value={formData.location}
          onChange={(value) =>
            setFormData({ ...formData, location: value })
          }
        />
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

export default RoomModal;
