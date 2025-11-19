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
  if (exchangeRate <= 0 || !fromToken || !toToken) return null;

  return (
    <div className="rounded-lg bg-muted p-3 space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Exchange Rate</span>
        <span className="font-medium">
          1 {fromToken} = {formatNumber(exchangeRate, 6)} {toToken}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Reverse Rate</span>
        <span className="font-medium">
          1 {toToken} = {formatNumber(1 / exchangeRate, 6)} {fromToken}
        </span>
      </div>
    </div>
  );
};
