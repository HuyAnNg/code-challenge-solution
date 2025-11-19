import { useState, useCallback } from 'react';
import type { ValidationError } from '@/types';

export const useSwapValidation = () => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateSwap = useCallback((
    fromToken: string,
    toToken: string,
    fromAmount: string
  ): boolean => {
    const newErrors: ValidationError[] = [];

    if (!fromToken) {
      newErrors.push({ field: 'fromToken', message: 'Please select a token to swap from' });
    }

    if (!toToken) {
      newErrors.push({ field: 'toToken', message: 'Please select a token to swap to' });
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      newErrors.push({ field: 'fromAmount', message: 'Please enter an amount greater than 0' });
    }

    if (fromToken === toToken) {
      newErrors.push({ field: 'toToken', message: 'Cannot swap to the same token' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => prev.filter((e) => e.field !== field));
  }, []);

  const getError = useCallback((field: string) => {
    return errors.find((e) => e.field === field)?.message;
  }, [errors]);

  return { errors, validateSwap, clearError, getError };
};
