import type { Token } from '@/types';

export const MAX_INPUT_LENGTH = 20;

export function formatInputValue(value: string): string {
  if (!value) return '';
  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function parseInputValue(value: string): string {
  return value.replace(/,/g, '');
}

export function calculateExchangeRate(fromToken?: Token, toToken?: Token): number {
  if (!fromToken || !toToken || fromToken.price === 0) return 0;
  return fromToken.price / toToken.price;
}

export function convertAmount(amount: number, fromToken: Token, toToken: Token): number {
  if (fromToken.currency === toToken.currency) return amount;
  if (fromToken.price > 0 && toToken.price > 0) {
    return (amount * fromToken.price) / toToken.price;
  }
  return 0;
}
