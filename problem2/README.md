## Problem 2 — Fancy Form

A polished React + Vite single page that mimics a modern swap interface. It fetches live token prices from `interview.switcheo.com`, lets users pick assets (complete with token icons from the Switcheo icon repo), and calculates conversion rates instantly. Input validation highlights misconfigurations (identical tokens, zero amounts, missing prices) and the UI includes a simple confirmation banner after a mock swap.

### Getting Started

```bash
cd problem2
npm install
npm run dev
```

Open the printed localhost URL to view the swapper.

### Implementation Notes

- Bootstrapped manually with Vite (React + TypeScript) for the requested bonus points.
- Token metadata lives in `src/data/tokens.ts`, while the price feed logic is encapsulated inside `src/hooks/useTokenPrices.ts`.
- `TokenSelect` is a custom dropdown component that displays icons, network names, and keeps the experience mouse/touch friendly.
- All conversions rely on the fetched USD prices: `receive = pay * (priceA / priceB)`.
- Styling is handcrafted in `src/index.css` to resemble a glassy, app-like swap form.
