# Problem 1 — Three Ways to Sum to `n`

This problem asks for three distinct implementations of a helper that returns the summation from `1` through `n`. The solution lives in `sumToN.js`, containing the three requested variations plus a small console demo.

## Implementation Notes

- `sum_to_n_a(n)` uses the closed-form arithmetic series formula `(n * (n + 1)) / 2`.
- `sum_to_n_b(n)` performs a simple iterative accumulation with a `for` loop.
- `sum_to_n_c(n)` solves the problem recursively: `sum(n) = n + sum(n - 1)` with the base case `sum(0/1) = n`.

## Running the Demo

Execute the file directly to compare all three implementations for a few sample inputs:

```bash
node sumToN.js
```

The script logs the results for inputs `5`, `10`, and `100` under each strategy so you can visually confirm they agree.
