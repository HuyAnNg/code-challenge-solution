export interface TokenPrice {
  currency: string;
  date: string;
  price: number;
}

export interface Token {
  currency: string;
  price: number;
  icon?: string;
}

export interface SwapState {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
}

export interface ValidationError {
  field: 'fromAmount' | 'fromToken' | 'toToken';
  message: string;
}
