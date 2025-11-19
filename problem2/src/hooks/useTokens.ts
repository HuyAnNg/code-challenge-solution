import { useEffect } from 'react';
import { fetchTokenPrices } from '@/lib/api';
import { useSwapStore } from '@/store/swapStore';

export const useTokens = () => {
  const { tokens, loading, setTokens, setLoading } = useSwapStore();

  useEffect(() => {
    const loadTokens = async () => {
      setLoading(true);
      const fetchedTokens = await fetchTokenPrices();
      setTokens(fetchedTokens);
    };

    if (tokens.length === 0) {
      loadTokens();
    }
  }, [tokens.length, setTokens, setLoading]);

  return { tokens, loading };
};
