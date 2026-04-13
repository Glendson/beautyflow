import React from 'react';
import { Modal } from '../ui/Modal';

export interface DeleteConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  entityName?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  title,
  message,
  entityName,
  isLoading = false,
  onConfirm,
  onCancel,
  confirmText = 'Deletar',
  cancelText = 'Cancelar',
  isDangerous = true,
}) => {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="space-y-4">
        <p className="text-gray-700">{message}</p>
        {entityName && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              <strong>Item:</strong> {entityName}
            </p>
          </div>
        )}
        <p className="text-sm text-red-600 font-medium">
          ⚠️ Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Deletando...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
