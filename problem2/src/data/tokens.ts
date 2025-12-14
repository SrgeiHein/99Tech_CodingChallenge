export interface TokenInfo {
  symbol: string;
  name: string;
  chain: string;
  icon: string;
}

const ICON_BASE =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";

export const TOKENS: TokenInfo[] = [
  {
    symbol: "SWTH",
    name: "Switcheo",
    chain: "Carbon",
    icon: `${ICON_BASE}/SWTH.svg`,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    chain: "Ethereum",
    icon: `${ICON_BASE}/ETH.svg`,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    chain: "Ethereum",
    icon: `${ICON_BASE}/USDC.svg`,
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    chain: "Bitcoin",
    icon: `${ICON_BASE}/BTC.svg`,
  },
  {
    symbol: "ATOM",
    name: "Cosmos",
    chain: "Cosmos",
    icon: `${ICON_BASE}/ATOM.svg`,
  },
  {
    symbol: "SOL",
    name: "Solana",
    chain: "Solana",
    icon: `${ICON_BASE}/SOL.svg`,
  },
  {
    symbol: "BNB",
    name: "BNB",
    chain: "BNB Chain",
    icon: `${ICON_BASE}/BNB.svg`,
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    chain: "Avalanche",
    icon: `${ICON_BASE}/AVAX.svg`,
  },
  {
    symbol: "LUNA",
    name: "Terra",
    chain: "Terra",
    icon: `${ICON_BASE}/LUNA.svg`,
  },
];
