import { convertAmount, MAX_INPUT_LENGTH, parseInputValue } from '@/lib/swapHelper';
import { useSwapStore } from '@/store/swapStore';
import type { Token } from '@/types';
import { useCallback } from 'react';
// All formatting and parsing logic is now in swapHelper.ts

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
        // Nếu token giống nhau thì toAmount = fromAmount
        if (selectedFromToken && selectedToToken && selectedFromToken.currency === selectedToToken.currency) {
          setToAmount(rawValue);
        } else if (selectedFromToken && selectedToToken && selectedFromToken.price > 0 && selectedToToken.price > 0) {
          const converted = convertAmount(amount, selectedFromToken, selectedToToken);
          setToAmount(converted > 0 ? String(converted) : '');
        } else {
          setToAmount('');
        }
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
        // Nếu token giống nhau thì fromAmount = toAmount
        if (selectedFromToken && selectedToToken && selectedFromToken.currency === selectedToToken.currency) {
          setFromAmount(rawValue);
        } else if (selectedFromToken && selectedToToken && selectedFromToken.price > 0 && selectedToToken.price > 0) {
          const converted = convertAmount(amount, selectedToToken, selectedFromToken);
          setFromAmount(converted > 0 ? String(converted) : '');
        } else {
          setFromAmount('');
        }
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
