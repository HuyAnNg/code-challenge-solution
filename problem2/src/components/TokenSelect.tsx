import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber, getTokenIconUrl } from "@/lib/api";
import type { Token } from "@/types";

interface TokenSelectProps {
  value: string;
  tokens: Token[];
  onValueChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export const TokenSelect = ({
  value,
  tokens,
  onValueChange,
  error,
  placeholder = "Select token",
}: TokenSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={error ? "border-red-500" : ""}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {tokens.map((token) => (
          <SelectItem key={token.currency} value={token.currency}>
            <div className="flex items-center gap-2">
              <img
                src={getTokenIconUrl(token.currency)}
                alt={token.currency}
                className="w-5 h-5 rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="font-medium">{token.currency}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                ${formatNumber(token.price, 4)}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
