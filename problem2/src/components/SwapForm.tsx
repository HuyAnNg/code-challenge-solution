import { AmountInput } from "@/components/AmountInput";
import { ExchangeRateInfo } from "@/components/ExchangeRateInfo";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { TokenSelect } from "@/components/TokenSelect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatInputValue } from "@/lib/swapHelper";
import { useSwapValidation } from "@/hooks/useSwapValidation";
import type { Token } from "@/types";
import { ArrowDownUp, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export function SwapForm() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    async function fetchTokens() {
      setLoading(true);
      const fetched = await import("@/lib/api").then((m) =>
        m.fetchTokenPrices()
      );
      setTokens(fetched);
      setLoading(false);
      if (fetched.length >= 2) {
        setFromToken(fetched[0].currency);
        setToToken(fetched[1].currency);
      }
    }
    fetchTokens();
  }, []);

  const selectedFromToken = useMemo(
    () => tokens.find((t: Token) => t.currency === fromToken),
    [tokens, fromToken]
  );

  const selectedToToken = useMemo(
    () => tokens.find((t: Token) => t.currency === toToken),
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

  const { validateSwap, getError } = useSwapValidation();

  // Calculation logic
  // Helper for removing commas
  const parseInputValue = (value: string) => value.replace(/,/g, "");
  const MAX_INPUT_LENGTH = 20;

  const handleFromAmountChange = (value: string) => {
    const rawValue = parseInputValue(value);
    if (rawValue.length > MAX_INPUT_LENGTH) return;
    if (rawValue === "" || /^\d*\.?\d*$/.test(rawValue)) {
      setFromAmount(rawValue);
      if (
        selectedFromToken &&
        selectedToToken &&
        selectedFromToken.currency === selectedToToken.currency
      ) {
        setToAmount(rawValue);
        return;
      }
      // Always run conversion logic, even if rawValue is empty
      if (rawValue && !isNaN(parseFloat(rawValue))) {
        const amount = parseFloat(rawValue);
        if (
          selectedFromToken &&
          selectedToToken &&
          selectedFromToken.price > 0 &&
          selectedToToken.price > 0
        ) {
          import("@/lib/api").then((m) => {
            const converted = m.convertAmount(
              amount,
              selectedFromToken,
              selectedToToken
            );
            setToAmount(converted > 0 ? String(converted) : "");
          });
        } else {
          setToAmount("");
        }
      } else {
        // If input is empty, clear the toAmount
        setToAmount("");
      }
    }
  };

  const handleToAmountChange = (value: string) => {
    const rawValue = parseInputValue(value);
    if (rawValue.length > MAX_INPUT_LENGTH) return;
    if (rawValue === "" || /^\d*\.?\d*$/.test(rawValue)) {
      setToAmount(rawValue);
      if (
        selectedFromToken &&
        selectedToToken &&
        selectedFromToken.currency === selectedToToken.currency
      ) {
        setFromAmount(rawValue);
        return;
      }
      if (rawValue && !isNaN(parseFloat(rawValue))) {
        const amount = parseFloat(rawValue);
        if (
          selectedFromToken &&
          selectedToToken &&
          selectedFromToken.price > 0 &&
          selectedToToken.price > 0
        ) {
          import("@/lib/api").then((m) => {
            const converted = m.convertAmount(
              amount,
              selectedToToken,
              selectedFromToken
            );
            setFromAmount(converted > 0 ? String(converted) : "");
          });
        } else {
          setFromAmount("");
        }
      } else {
        setFromAmount("");
      }
    }
  };

  // Đã xử lý swap đúng bằng switchTokens, không cần tự động tính lại số lượng khi đổi token

  const switchedRef = useRef(false);
  const handleSwitchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    // Always recalculate To value and rate after switching
    setTimeout(() => {
      handleFromAmountChange(fromAmount);
    }, 0);
    switchedRef.current = true;
  };
  // Đã loại bỏ useEffect này, logic chuyển token đã được xử lý trong handleSwitchTokens và các hàm input.

  const handleSwap = async () => {
    if (!validateSwap(fromToken, toToken, fromAmount)) return;

    setIsSwapping(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
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
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-purple-950 transition-all">
      <ThemeSwitcher />
      <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md shadow-2xl dark:bg-zinc-900/80 dark:text-white px-2 sm:px-4 py-4">
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
                onValueChange={(token) => {
                  setFromToken(token);
                  handleFromAmountChange(fromAmount);
                }}
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
            {/* Remove USD display below input */}
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
                onValueChange={(token) => {
                  setToToken(token);
                  handleFromAmountChange(fromAmount);
                }}
                error={getError("toToken")}
              />
              <AmountInput
                value={toAmount}
                onChange={handleToAmountChange}
                error={getError("toToken")}
                selectedToken={selectedToToken}
                formatValue={formatInputValue}
                disabled
              />
            </div>
            {/* Remove USD display below input */}
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
