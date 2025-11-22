import { formatNumber } from "@/lib/api";

interface ExchangeRateInfoProps {
  exchangeRate: number;
  fromToken: string;
  toToken: string;
}

export const ExchangeRateInfo = ({
  exchangeRate,
  fromToken,
  toToken,
}: ExchangeRateInfoProps) => {
  if (!fromToken || !toToken) return null;

  // If tokens are the same, exchange rate is always 1
  const isSameToken = fromToken === toToken;
  const displayRate = isSameToken ? 1 : exchangeRate;
  const displayReverse = isSameToken
    ? 1
    : exchangeRate > 0
    ? 1 / exchangeRate
    : 0;

  return (
    <div className="rounded-lg bg-muted p-3 space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Exchange Rate</span>
        <span className="font-medium">
          1 {fromToken} = {formatNumber(displayRate, 6)} {toToken}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Reverse Rate</span>
        <span className="font-medium">
          1 {toToken} = {formatNumber(displayReverse, 6)} {fromToken}
        </span>
      </div>
    </div>
  );
};
