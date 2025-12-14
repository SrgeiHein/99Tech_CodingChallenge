import { useEffect, useState } from "react";

const PRICE_ENDPOINT = "https://interview.switcheo.com/prices.json";

export type PriceMap = Record<string, number>;

interface PriceResult {
  currency: string;
  price: number;
}

interface PriceState {
  status: "idle" | "loading" | "ready" | "error";
  data: PriceMap;
  error?: string;
}

export const useTokenPrices = () => {
  const [state, setState] = useState<PriceState>({
    status: "idle",
    data: {},
  });

  useEffect(() => {
    let active = true;
    setState({ status: "loading", data: {} });

    fetch(PRICE_ENDPOINT)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fetch prices");
        }
        return response.json() as Promise<PriceResult[]>;
      })
      .then((payload) => {
        if (!active) {
          return;
        }
        const map: PriceMap = {};
        payload.forEach((entry) => {
          if (entry.currency && typeof entry.price === "number") {
            map[entry.currency.toUpperCase()] = entry.price;
          }
        });
        setState({ status: "ready", data: map });
      })
      .catch((error: Error) => {
        if (!active) {
          return;
        }
        setState({ status: "error", data: {}, error: error.message });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
};
