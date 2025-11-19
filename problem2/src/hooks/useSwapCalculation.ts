import { useCallback } from 'react';
import { convertAmount } from '@/lib/api';
import { useSwapStore } from '@/store/swapStore';
import type { Token } from '@/types';

const MAX_INPUT_LENGTH = 20;

// Format number with commas for display
export const formatInputValue = (value: string): string => {
  if (!value) return '';
  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

// Remove commas for calculation
const parseInputValue = (value: string): string => {
  return value.replace(/,/g, '');
};

export const useSwapCalculation = (
  selectedFromToken: Token | undefined,
  selectedToToken: Token | undefined,
  onFromAmountChange?: () => void,
  onToAmountChange?: () => void
) => {
  const { fromAmount, toAmount, setFromAmount, setToAmount } = useSwapStore();

  const handleFromAmountChange = useCallback((value: string) => {
    const rawValue = parseInputValue(value);

    if (rawValue.length > MAX_INPUT_LENGTH) return;

    if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
      setFromAmount(rawValue);
      onFromAmountChange?.();

      if (rawValue && !isNaN(parseFloat(rawValue))) {
        const amount = parseFloat(rawValue);
        const converted = convertAmount(amount, selectedFromToken, selectedToToken);
        setToAmount(converted > 0 ? String(converted) : '');
      } else {
        setToAmount('');
      }
    }
  }, [selectedFromToken, selectedToToken, onFromAmountChange, setFromAmount, setToAmount]);

  const handleToAmountChange = useCallback((value: string) => {
    const rawValue = parseInputValue(value);

    if (rawValue.length > MAX_INPUT_LENGTH) return;

    if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
      setToAmount(rawValue);
      onToAmountChange?.();

      if (rawValue && !isNaN(parseFloat(rawValue))) {
        const amount = parseFloat(rawValue);
        const converted = convertAmount(amount, selectedToToken, selectedFromToken);
        setFromAmount(converted > 0 ? String(converted) : '');
      } else {
        setFromAmount('');
      }
    }
  }, [selectedFromToken, selectedToToken, onToAmountChange, setFromAmount, setToAmount]);

  return {
    fromAmount,
    toAmount,
    handleFromAmountChange,
    handleToAmountChange,
  };
};
