import { create } from 'zustand';
import type { Token } from '@/types';

interface SwapState {
  // Token data
  tokens: Token[];
  loading: boolean;
  
  // Selected tokens
  fromToken: string;
  toToken: string;
  
  // Amounts
  fromAmount: string;
  toAmount: string;
  
  // UI state
  isSwapping: boolean;
  
  // Actions
  setTokens: (tokens: Token[]) => void;
  setLoading: (loading: boolean) => void;
  setFromToken: (token: string) => void;
  setToToken: (token: string) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  setIsSwapping: (isSwapping: boolean) => void;
  switchTokens: () => void;
  reset: () => void;
}

export const useSwapStore = create<SwapState>((set, get) => ({
  // Initial state
  tokens: [],
  loading: true,
  fromToken: '',
  toToken: '',
  fromAmount: '',
  toAmount: '',
  isSwapping: false,
  
  // Actions
  setTokens: (tokens) => {
    set({ tokens, loading: false });
    // Auto-set default tokens if not set
    const state = get();
    if (tokens.length >= 2 && !state.fromToken) {
      set({
        fromToken: tokens[0].currency,
        toToken: tokens[1].currency,
      });
    }
  },
  
  setLoading: (loading) => set({ loading }),
  setFromToken: (fromToken) => set({ fromToken }),
  setToToken: (toToken) => set({ toToken }),
  setFromAmount: (fromAmount) => set({ fromAmount }),
  setToAmount: (toAmount) => set({ toAmount }),
  setIsSwapping: (isSwapping) => set({ isSwapping }),
  
  switchTokens: () => {
    const { fromToken, toToken, fromAmount, toAmount } = get();
    set({
      fromToken: toToken,
      toToken: fromToken,
      fromAmount: toAmount,
      toAmount: fromAmount,
    });
  },
  
  reset: () => set({
    fromAmount: '',
    toAmount: '',
    isSwapping: false,
  }),
}));
