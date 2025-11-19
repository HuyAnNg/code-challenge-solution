# Problem 2 - Code Optimization Summary

## Refactoring Overview

Code đã được tối ưu hóa với các nguyên tắc sau:

### 1. **Custom Hooks** - Tách logic ra khỏi component

#### `useTokens.ts`

- Quản lý việc fetch và lưu trữ tokens
- Tách logic data fetching ra khỏi UI component
- Dễ dàng test và reuse

#### `useSwapValidation.ts`

- Centralize validation logic
- Cung cấp các methods: `validateSwap`, `clearError`, `getError`
- Dễ dàng mở rộng thêm validation rules

#### `useSwapCalculation.ts`

- Xử lý tất cả logic tính toán conversion
- Format input với dấu phẩy
- Giới hạn 20 ký tự
- Bidirectional calculation (from ↔ to)
- Sử dụng `useCallback` để tối ưu performance

### 2. **Reusable Components** - Component có thể tái sử dụng

#### `TokenSelect.tsx`

- Component select token được tách riêng
- Props rõ ràng và type-safe
- Có thể reuse cho cả fromToken và toToken
- Tự động xử lý icon error

#### `AmountInput.tsx`

- Input component với validation và format
- Hiển thị USD value
- Error handling built-in
- Format number với dấu phẩy

#### `ExchangeRateInfo.tsx`

- Component hiển thị exchange rate
- Tự động ẩn khi không có rate
- Clean và dễ maintain

### 3. **Performance Optimization**

- ✅ `useMemo` cho calculated values (selectedToken, exchangeRate)
- ✅ `useCallback` cho event handlers
- ✅ Tránh re-render không cần thiết
- ✅ Lazy evaluation

### 4. **Code Organization**

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── SwapForm.tsx     # Main component (refactored)
│   ├── TokenSelect.tsx  # Reusable token selector
│   ├── AmountInput.tsx  # Reusable amount input
│   └── ExchangeRateInfo.tsx # Exchange rate display
├── hooks/
│   ├── useTokens.ts           # Token data management
│   ├── useSwapValidation.ts   # Validation logic
│   └── useSwapCalculation.ts  # Calculation & formatting
├── lib/
│   ├── api.ts           # API & utility functions
│   └── utils.ts         # Helper functions
└── types/
    └── index.ts         # TypeScript types
```

### 5. **Benefits**

1. **Maintainability**: Mỗi file có responsibility rõ ràng
2. **Reusability**: Components và hooks có thể dùng lại
3. **Testability**: Dễ dàng unit test từng phần
4. **Readability**: Code ngắn gọn, dễ hiểu
5. **Type Safety**: Full TypeScript support
6. **Performance**: Optimized re-renders

### 6. **Before vs After**

**Before:**

- 1 file lớn ~380 lines
- Logic lẫn lộn với UI
- Khó test và maintain
- Duplicate code

**After:**

- Main component: ~130 lines
- 3 custom hooks
- 3 reusable components
- Separation of concerns
- No duplicate code

## Usage Example

```tsx
// SwapForm.tsx - Clean and concise
export function SwapForm() {
  const { tokens, loading } = useTokens();
  const { validateSwap, getError } = useSwapValidation();
  const { fromAmount, toAmount, handleFromAmountChange, formatInputValue } =
    useSwapCalculation(selectedFromToken, selectedToToken);

  // Clean render
  return (
    <Card>
      <TokenSelect {...props} />
      <AmountInput {...props} />
      <ExchangeRateInfo {...props} />
    </Card>
  );
}
```

## Future Improvements

- [ ] Add unit tests cho hooks
- [ ] Add Storybook cho components
- [ ] Implement error boundaries
- [ ] Add loading skeletons
- [ ] Cache token data
- [ ] Add toast notifications thay vì alert
