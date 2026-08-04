"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import CandlestickChart from "../CandlestickChart";
import { CoinOverviewFallback } from "./fallback";

import { fetcher } from "@/lib/coingecko.actions";
import { formatCurrency } from "@/lib/utils";

const CoinOverview = () => {
  const [coin, setCoin] = useState<CoinDetailsData | null>(null);
  const [coinOHLCData, setCoinOHLCData] = useState<OHLCData[] | null>(null);
  useEffect(() => {
    async function getCoinData() {
      try {
        const coinData = await fetcher<CoinDetailsData>("/coins/bitcoin", {
          dex_pair_format: "symbol",
        });
        setCoin(coinData);
        const coinDataOHLCData = await fetcher<OHLCData[]>(
          "/coins/bitcoin/ohlc",
          {
            vs_currency: "usd",
            days: 1,
            precision: "full",
          },
        );
        setCoinOHLCData(coinDataOHLCData);
      } catch (error) {
        console.error("Error fetching coin overview:", error);
      }
    }
    getCoinData();
  }, []);

  if (!coin || !coinOHLCData?.length) return <CoinOverviewFallback />;

  return (
    <div id="coin-overview">
      <CandlestickChart data={coinOHLCData as OHLCData[]} coinId="bitcoin">
        <div className="header pt-2 max-sm:pt-0 items-center">
          <Image
            src={coin.image.large}
            alt={coin.name}
            width={56}
            height={56}
          />
          <div className="info">
            <p className="max-sm:text-xl">
              {coin.name} / {coin.symbol.toUpperCase()}
            </p>
            <h1 className="text-amber-50 max-sm:text-2xl">
              {formatCurrency(coin.market_data.current_price.usd)}
            </h1>
          </div>
        </div>
      </CandlestickChart>
    </div>
  );
};

export default CoinOverview;
