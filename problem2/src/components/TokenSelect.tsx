import { FC, useEffect, useMemo, useRef, useState } from "react";
import type { TokenInfo } from "../data/tokens";

interface TokenSelectProps {
  label: string;
  tokens: TokenInfo[];
  value: TokenInfo | null;
  onChange: (token: TokenInfo) => void;
  disabled?: boolean;
}

const ChevronIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const TokenSelect: FC<TokenSelectProps> = ({
  label,
  tokens,
  value,
  onChange,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedPreview = useMemo(() => {
    if (!value) {
      return (
        <span className="token-select__placeholder">Select token</span>
      );
    }
    return (
      <>
        <img
          src={value.icon}
          alt={value.symbol}
          className="token-select__icon"
          loading="lazy"
        />
        <span className="token-select__symbol">{value.symbol}</span>
        <span className="token-select__name">{value.name}</span>
      </>
    );
  }, [value]);

  const handleSelect = (token: TokenInfo) => {
    onChange(token);
    setOpen(false);
  };

  return (
    <div className="token-select" ref={containerRef}>
      <span className="token-select__label">{label}</span>
      <button
        type="button"
        className="token-select__trigger"
        onClick={() => setOpen((previous) => !previous)}
        disabled={disabled || tokens.length === 0}
        aria-expanded={open}
      >
        {selectedPreview}
        <ChevronIcon />
      </button>
      {open && (
        <div className="token-select__dropdown">
          {tokens.map((token) => (
            <button
              type="button"
              key={token.symbol}
              onClick={() => handleSelect(token)}
              className={`token-select__option ${
                token.symbol === value?.symbol
                  ? "token-select__option--selected"
                  : ""
              }`}
            >
              <img
                src={token.icon}
                alt={token.symbol}
                loading="lazy"
                className="token-select__icon"
              />
              <div className="token-select__details">
                <span className="token-select__symbol">{token.symbol}</span>
                <span className="token-select__name">{token.name}</span>
              </div>
              <span className="token-select__chain">{token.chain}</span>
            </button>
          ))}
          {tokens.length === 0 && (
            <div className="token-select__empty">
              Prices unavailable — try again later.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
