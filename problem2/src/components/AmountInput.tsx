import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/api";
import type { Token } from "@/types";
import { X } from "lucide-react";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  selectedToken?: Token;
  formatValue: (value: string) => string;
  placeholder?: string;
  disabled?: boolean;
}

export const AmountInput = ({
  value,
  onChange,
  error,
  selectedToken,
  formatValue,
  placeholder = "0.0",
  disabled,
}: AmountInputProps) => {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={formatValue(value)}
          onChange={(e) => onChange(e.target.value)}
          className={`text-2xl sm:text-xl md:text-2xl font-semibold h-14 sm:h-12 pr-12 sm:pr-10 rounded-xl bg-white/70 dark:bg-zinc-800/70 border-2 border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-purple-500 dark:focus:ring-purple-400 transition-all shadow-md dark:shadow-lg ${
            error ? "border-red-500" : ""
          }`}
          disabled={disabled}
        />
        {value && !disabled && (
          <X
            role="button"
            tabIndex={0}
            aria-label="Clear"
            onClick={() => onChange("")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onChange("");
            }}
            className="absolute right-3 sm:right-2 top-1/2 -translate-y-1/2 cursor-pointer w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-purple-300 transition-all"
          />
        )}
      </div>
      {error && (
        <p className="text-xs sm:text-[11px] text-red-500 font-medium drop-shadow">
          {error}
        </p>
      )}
      {selectedToken && value && (
        <p className="text-xs sm:text-[11px] text-muted-foreground font-medium">
          ≈{" "}
          <span className="font-bold text-blue-600 dark:text-purple-400">
            ${formatNumber(parseFloat(value || "0") * selectedToken.price, 2)}
          </span>{" "}
          USD
        </p>
      )}
    </div>
  );
};
