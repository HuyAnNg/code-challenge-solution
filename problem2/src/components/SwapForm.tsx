import { useMemo, useEffect } from "react";
import { ArrowDownUp, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTokens } from "@/hooks/useTokens";
import { useSwapValidation } from "@/hooks/useSwapValidation";
import {
  useSwapCalculation,
  formatInputValue,
} from "@/hooks/useSwapCalculation";
import { TokenSelect } from "@/components/TokenSelect";
import { AmountInput } from "@/components/AmountInput";
import { ExchangeRateInfo } from "@/components/ExchangeRateInfo";
import { useSwapStore } from "@/store/swapStore";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function SwapForm() {
  useTokens();
  const {
    tokens,
    loading,
    fromToken,
    toToken,
    isSwapping,
    setFromToken,
    setToToken,
    setIsSwapping,
    switchTokens,
  } = useSwapStore();

  const selectedFromToken = useMemo(
    () => tokens.find((t) => t.currency === fromToken),
    [tokens, fromToken]
  );

  const selectedToToken = useMemo(
    () => tokens.find((t) => t.currency === toToken),
    [tokens, toToken]
  );

  const exchangeRate = useMemo(() => {
    if (
      !selectedFromToken ||
      !selectedToToken ||
      selectedFromToken.price === 0
    ) {
      return 0;
    }
    return selectedFromToken.price / selectedToToken.price;
  }, [selectedFromToken, selectedToToken]);

  const { validateSwap, clearError, getError } = useSwapValidation();

  const { fromAmount, toAmount, handleFromAmountChange, handleToAmountChange } =
    useSwapCalculation(
      selectedFromToken,
      selectedToToken,
      () => clearError("fromAmount"),
      () => clearError("toAmount")
    );

  // Tự động đổi số tiền khi chọn token khác
  useEffect(() => {
    if (fromAmount && selectedFromToken && selectedToToken) {
      // Chỉ cập nhật khi token đổi
      handleFromAmountChange(fromAmount); // chỉ gọi khi token đổi
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFromToken, selectedToToken]);

  const handleSwitchTokens = () => {
    switchTokens();
  };

  const handleSwap = async () => {
    if (!validateSwap(fromToken, toToken, fromAmount)) return;

    setIsSwapping(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSwapping(false);

    alert(
      `Successfully swapped ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <ThemeSwitcher />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-purple-950 transition-all">
      <ThemeSwitcher />
      <Card className="w-full max-w-md shadow-2xl dark:bg-zinc-900/80 dark:text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Swap Tokens
          </CardTitle>
          <CardDescription>
            Exchange your tokens instantly with the best rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* From Token Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">From</label>
            <div className="space-y-2">
              <TokenSelect
                value={fromToken}
                tokens={tokens}
                onValueChange={setFromToken}
                error={getError("fromToken")}
              />
              <AmountInput
                value={fromAmount}
                onChange={handleFromAmountChange}
                error={getError("fromAmount")}
                selectedToken={selectedFromToken}
                formatValue={formatInputValue}
              />
            </div>
          </div>

          {/* Switch Button */}
          <div className="flex justify-center -my-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwitchTokens}
              className="rounded-full h-10 w-10 border-2 hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
            >
              <ArrowDownUp className="h-5 w-5" />
            </Button>
          </div>

          {/* To Token Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">To</label>
            <div className="space-y-2">
              <TokenSelect
                value={toToken}
                tokens={tokens}
                onValueChange={setToToken}
                error={getError("toToken")}
              />
              <AmountInput
                value={toAmount}
                onChange={handleToAmountChange}
                error={getError("toToken")}
                selectedToken={selectedToToken}
                formatValue={formatInputValue}
              />
            </div>
          </div>

          {/* Exchange Rate Info */}
          <ExchangeRateInfo
            exchangeRate={exchangeRate}
            fromToken={fromToken}
            toToken={toToken}
          />

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={isSwapping || !fromAmount || !toAmount}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isSwapping ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Swapping...
              </>
            ) : (
              "Swap Tokens"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
