import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/api";
import type { Token } from "@/types";
import { ClearIcon } from "@/components/icons/ClearIcon";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  selectedToken?: Token;
  formatValue: (value: string) => string;
  placeholder?: string;
}

export const AmountInput = ({
  value,
  onChange,
  error,
  selectedToken,
  formatValue,
  placeholder = "0.0",
}: AmountInputProps) => {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={formatValue(value)}
          onChange={(e) => onChange(e.target.value)}
          className={`text-2xl font-semibold h-14 pr-12 rounded-xl bg-white/70 dark:bg-zinc-800/70 border-2 border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-purple-500 dark:focus:ring-purple-400 transition-all shadow-md dark:shadow-lg ${
            error ? "border-red-500" : ""
          }`}
        />
        {value && (
          <button
            type="button"
            aria-label="Clear"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 dark:bg-zinc-700/80 hover:bg-blue-100 dark:hover:bg-purple-900 shadow transition-all"
            onClick={() => onChange("")}
          >
            <ClearIcon className="w-5 h-5 text-gray-400 dark:text-gray-300" />
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium drop-shadow">{error}</p>
      )}
      {selectedToken && value && (
        <p className="text-xs text-muted-foreground font-medium">
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
