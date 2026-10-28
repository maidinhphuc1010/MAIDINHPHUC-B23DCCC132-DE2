import { useContext } from 'react';
import { FieldContext } from '../context/FieldContext';

export function useFields() {
  const context = useContext(FieldContext);
  if (!context) throw new Error('useFields phải được sử dụng bên trong FieldProvider.');
  return {
    fields: context.fields,
    activeCount: context.fields.filter(field => field.status === 'Hoạt động').length,
    loading: context.loading,
    error: context.error,
    addField: context.addField,
    updateField: context.updateField,
    deleteField: context.deleteField,
    getFieldById: context.getFieldById,
  };
}
