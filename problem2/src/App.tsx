import { FormEvent, useEffect, useMemo, useState } from "react";
import { TokenSelect } from "./components/TokenSelect";
import { TOKENS, TokenInfo } from "./data/tokens";
import { useTokenPrices } from "./hooks/useTokenPrices";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value >= 1 ? 4 : 8,
  }).format(value);

const getTokenBySymbol = (tokens: TokenInfo[], symbol?: string | null) => {
  if (!symbol) {
    return null;
  }
  return tokens.find((token) => token.symbol === symbol) ?? null;
};

function App() {
  const { data: prices, status, error } = useTokenPrices();
  const priceReady = status === "ready";

  const tradableTokens = useMemo(() => {
    return TOKENS.filter((token) => prices[token.symbol]);
  }, [prices]);

  const [fromToken, setFromToken] = useState<TokenInfo | null>(null);
  const [toToken, setToToken] = useState<TokenInfo | null>(null);
  const [amount, setAmount] = useState("1.5");
  const [swapMessage, setSwapMessage] = useState("");

  useEffect(() => {
    if (!tradableTokens.length) {
      setFromToken(null);
      setToToken(null);
      return;
    }
    setFromToken((current) => {
      if (!current) {
        return tradableTokens[0];
      }
      return getTokenBySymbol(tradableTokens, current.symbol) ?? tradableTokens[0];
    });
    setToToken((current) => {
      if (!current || current.symbol === tradableTokens[0]?.symbol) {
        return tradableTokens[1] ?? tradableTokens[0] ?? null;
      }
      return getTokenBySymbol(tradableTokens, current.symbol) ?? tradableTokens[1] ?? tradableTokens[0] ?? null;
    });
  }, [tradableTokens]);

  const numericAmount = Number(amount);

  const conversionRate = useMemo(() => {
    if (!fromToken || !toToken) {
      return 0;
    }
    const fromPrice = prices[fromToken.symbol];
    const toPrice = prices[toToken.symbol];
    if (!fromPrice || !toPrice) {
      return 0;
    }
    return fromPrice / toPrice;
  }, [fromToken, toToken, prices]);

  const receiveAmount =
    !Number.isNaN(numericAmount) && numericAmount > 0
      ? numericAmount * conversionRate
      : 0;

  const formError = useMemo(() => {
    if (!fromToken || !toToken) {
      return "Choose two assets to start swapping.";
    }
    if (fromToken.symbol === toToken.symbol) {
      return "Pick two different tokens.";
    }
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return "Enter an amount greater than zero.";
    }
    if (!conversionRate) {
      return "Exchange rate unavailable for the selected pair.";
    }
    return "";
  }, [fromToken, toToken, numericAmount, conversionRate]);

  const handleSwap = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formError || !fromToken || !toToken) {
      return;
    }
    setSwapMessage(
      `Swapped ${formatNumber(numericAmount)} ${fromToken.symbol} for approximately ${formatNumber(
        receiveAmount,
      )} ${toToken.symbol}.`,
    );
    setTimeout(() => setSwapMessage(""), 3500);
  };

  const handleFlip = () => {
    if (!fromToken || !toToken) {
      return;
    }
    setFromToken(toToken);
    setToToken(fromToken);
  };

  return (
    <div className="page">
      <header className="hero">
        <span className="hero__eyebrow">Problem 2</span>
        <h1 className="hero__title">Currency Swap</h1>
        <p className="hero__subtitle">
          Seamlessly trade between supported assets using live pricing sourced from
          Switcheo&apos;s markets.
        </p>
      </header>

      <main className="swap-card">
        <div className="swap-card__header">
          <div>
            <p className="swap-card__eyebrow">Live</p>
            <h2>Swap Assets</h2>
          </div>
          <span className={`status-dot status-dot--${status}`}>
            {status === "loading" && "Syncing prices"}
            {status === "ready" && "All prices up to date"}
            {status === "error" && "Price feed unavailable"}
          </span>
        </div>

        <form className="swap-form" onSubmit={handleSwap}>
          <section className="amount-panel">
            <div className="panel-top">
              <TokenSelect
                label="You pay"
                tokens={tradableTokens}
                value={fromToken}
                onChange={setFromToken}
                disabled={!priceReady}
              />
              <div className="input-wrapper">
                <label htmlFor="from-amount">Amount</label>
                <input
                  id="from-amount"
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.0"
                />
                <span className="input-hint">
                  ${" "}
                  {fromToken && prices[fromToken.symbol]
                    ? formatNumber(numericAmount * prices[fromToken.symbol])
                    : "0.00"}{" "}
                  USD
                </span>
              </div>
            </div>

            <button
              type="button"
              className="flip-button"
              onClick={handleFlip}
              aria-label="Swap direction"
            >
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path
                  d="M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3-3m-3 3 3 3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </button>

            <div className="panel-bottom">
              <TokenSelect
                label="You receive"
                tokens={tradableTokens}
                value={toToken}
                onChange={setToToken}
                disabled={!priceReady}
              />
              <div className="input-wrapper">
                <label>Estimated amount</label>
                <div className="readout">
                  {receiveAmount ? formatNumber(receiveAmount) : "0.0000"}
                </div>
                <span className="input-hint">
                  ≈{" "}
                  {toToken && prices[toToken.symbol]
                    ? `$ ${formatNumber(receiveAmount * prices[toToken.symbol])} USD`
                    : "$ 0.00 USD"}
                </span>
              </div>
            </div>
          </section>

          <div className="rate-line">
            {fromToken && toToken && conversionRate ? (
              <>
                <span>
                  1 {fromToken.symbol} = {formatNumber(conversionRate)} {toToken.symbol}
                </span>
                <span>
                  1 {toToken.symbol} = {formatNumber(1 / conversionRate)} {fromToken.symbol}
                </span>
              </>
            ) : (
              <span>Waiting for live exchange rates…</span>
            )}
          </div>

          {error && status === "error" && (
            <p className="error-banner">{error}</p>
          )}

          {formError && (
            <p className="error-inline" role="alert">
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="swap-button"
            disabled={Boolean(formError) || status !== "ready"}
          >
            {status !== "ready" ? "Fetching prices…" : "Swap Now"}
          </button>
        </form>

        {swapMessage && <p className="success-banner">{swapMessage}</p>}
      </main>
    </div>
  );
}

export default App;
