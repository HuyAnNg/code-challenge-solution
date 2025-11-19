import type { Token, TokenPrice } from '@/types';

const PRICES_URL = 'https://interview.switcheo.com/prices.json';
const TOKEN_ICONS_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

// Map các token có tên khác trong icon repository và display name
const TOKEN_DISPLAY_MAP: Record<string, string> = {
  'STATOM': 'stATOM',
  'STLUNA': 'stLUNA',
  'STOSMO': 'stOSMO',
  'STEVMOS': 'stEVMOS',
  'RATOM': 'rATOM',
};

export const fetchTokenPrices = async (): Promise<Token[]> => {
  try {
    const response = await fetch(PRICES_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch token prices');
    }
    const data: TokenPrice[] = await response.json();
    
    const tokenMap = new Map<string, Token>();
    
    data.forEach((item) => {
      if (item.price > 0) {
        const existing = tokenMap.get(item.currency);
        if (!existing || new Date(item.date) > new Date(existing.price)) {
          const displayName = TOKEN_DISPLAY_MAP[item.currency] || item.currency;
          tokenMap.set(item.currency, {
            currency: displayName, 
            price: item.price,
            icon: getTokenIconUrl(item.currency),
          });
        }
      }
    });
    
    return Array.from(tokenMap.values()).sort((a, b) => 
      a.currency.localeCompare(b.currency)
    );
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return [];
  }
};

export const getTokenIconUrl = (currency: string): string => {
  const iconName = TOKEN_DISPLAY_MAP[currency] || currency;
  return `${TOKEN_ICONS_BASE_URL}/${iconName}.svg`;
};

export const calculateExchangeRate = (
  fromToken: Token | undefined,
  toToken: Token | undefined
): number => {
  if (!fromToken || !toToken || fromToken.price === 0) {
    return 0;
  }
  return fromToken.price / toToken.price;
};

export const convertAmount = (
  amount: number,
  fromToken: Token | undefined,
  toToken: Token | undefined
): number => {
  const rate = calculateExchangeRate(fromToken, toToken);
  return amount * rate;
};

export const formatNumber = (num: number, decimals: number = 6): string => {
  if (num === 0) return '0';
  if (num < 0.000001) return num.toExponential(2);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};
