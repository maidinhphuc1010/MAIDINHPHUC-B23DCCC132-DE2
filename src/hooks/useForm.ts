import { useCallback, useState } from 'react';
import type { FormErrors } from '../types';

type FormValues = object;

export interface UseFormReturn<TValues extends FormValues> {
  values: TValues;
  errors: FormErrors<TValues>;
  setFieldValue: <TKey extends keyof TValues>(field: TKey, value: TValues[TKey]) => void;
  resetForm: (nextValues?: TValues) => void;
  setErrors: (errors: FormErrors<TValues>) => void;
}

export function useForm<TValues extends FormValues>(initialValues: TValues): UseFormReturn<TValues> {
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors<TValues>>({});

  const setFieldValue = useCallback(<TKey extends keyof TValues>(field: TKey, value: TValues[TKey]) => {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const resetForm = useCallback((nextValues: TValues = initialValues) => {
    setValues(nextValues);
    setErrors({});
  }, [initialValues]);

  return { values, errors, setFieldValue, resetForm, setErrors };
}
