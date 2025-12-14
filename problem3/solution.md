# Problem 3 — Messy React

## Issues Identified

1. **Undefined variables in the filter predicate.** Inside the `balances.filter` callback, `lhsPriority` is referenced even though only `balancePriority` is defined. This would throw at runtime, preventing any rendering.
2. **Incorrect filtering condition.** The filter returns `true` only when `balance.amount <= 0`, which contradicts the usual goal of displaying wallets with positive balances. It also ignores balances from unknown blockchains even though later code attempts to handle them.
3. **Comparator missing equality branch.** The `sort` callback never returns `0`, so equal priorities still fall through to `undefined`, potentially causing an unstable sort.
4. **Dependencies for `useMemo` are wrong.** The memoized `sortedBalances` depends only on `balances`, yet `prices` is listed as a dependency even though it is unused. This causes unnecessary recomputations.
5. **Repeated priority calculation.** `getPriority` is called multiple times for the same balance (once in `filter`, twice in `sort`), wasting cycles and creating inconsistent behavior if the function ever changes.
6. **Derived data is unused/mismatched.** `formattedBalances` is created but never consumed. Later, `rows` treats `sortedBalances` as `FormattedWalletBalance` (using `.formatted`) even though that property does not exist, yielding `undefined`.
7. **Inefficient key usage.** `index` is used as the React `key`, which is fragile for lists that can change order (they do, because the array is sorted). Stable identifiers such as `currency` should be used instead.
8. **`getPriority` defined inline each render.** The function is re-created on every render even though it does not depend on props/state. Extracting it out of the component keeps referential equality and allows reuse in memoized callbacks.
9. **`WalletRow` props computed per render without memoization.** Recomputing derived rows (with `prices` lookups) without memoization leads to extra work even when inputs do not change.
10. **Type mismatches.** Interfaces omit the `blockchain` property even though the code relies on it, and `Props` extends `BoxProps` but spreads every prop into a `div`, which may leak unsupported DOM attributes.

## Refactored Component

```tsx
import type { FC } from "react";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

interface Props extends BoxProps {}

const PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: string): number => PRIORITY[blockchain] ?? -1;

export const WalletPage: FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const rows = useMemo<FormattedWalletBalance[]>(() => {
    return balances
      .filter(
        (balance) => getPriority(balance.blockchain) >= 0 && balance.amount > 0
      )
      .map((balance) => {
        const priority = getPriority(balance.blockchain);
        const usdValue = (prices[balance.currency] ?? 0) * balance.amount;

        return {
          ...balance,
          priority,
          usdValue,
          formatted: balance.amount.toFixed(2),
        };
      })
      .sort((lhs, rhs) => rhs.priority - lhs.priority);
  }, [balances, prices]);

  return (
    <div {...rest}>
      {rows.map((balance) => (
        <WalletRow
          className={classes.row}
          key={balance.currency}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
      {children}
    </div>
  );
};
```

### Improvements

- `getPriority` is extracted alongside a priority map, simplifying lookups and ensuring the function reference is stable.
- Filtering now keeps only positive balances with a valid blockchain priority, using consistent conditions and avoiding runtime errors.
- Mapping into `FormattedWalletBalance` includes both formatting and USD conversion, so the rendering loop consumes a single derived array.
- Sorting happens after mapping, using the precomputed `priority`, eliminating redundant lookups and ensuring the comparator always returns a number.
- Stable keys (currency) are used for `WalletRow`, and `children` are rendered explicitly to avoid accidentally discarding consumers’ content.
