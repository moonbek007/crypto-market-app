"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { fetcher } from "@/lib/coingecko.actions";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";

export default function CryptoSearchModal() {
  const [searchToken, setSearchToken] = useState("");
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[] | null>(
    null,
  );

  useEffect(() => {
    const getTrendingCoins = async () => {
      const { coins: tCoins } = await fetcher<{ coins: TrendingCoin[] }>(
        "/search/trending",
        undefined,
        300,
      );
      setTrendingCoins(tCoins.slice(0, 5));
    };
    getTrendingCoins();
  }, []);

  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger
          asChild={true}
          render={
            <Button className="px-5 py-2.5 bg-green-500 text-gray-900 font-semibold rounded-lg text-sm shadow-lg cursor-pointer">
              Search
            </Button>
          }
        ></DialogTrigger>

        <DialogContent
          showCloseButton={false}
          className="sm:max-w-160 bg-[#121c2e] border-white/5 p-6 shadow-2xl rounded-xl gap-0 text-white"
        >
          <DialogHeader className="mb-6 space-y-0">
            <DialogTitle className="sr-only">Search</DialogTitle>
            <div className="flex gap-3 mt-2">
              <div className="relative flex-1 flex items-center">
                <Search
                  className="absolute left-4 text-[#8fa0dd]/60"
                  size={18}
                />

                <Input
                  type="text"
                  placeholder="Search for a token by name or symbol"
                  //   value={searchToken}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchToken(e.target.value)
                  }
                  className="w-full bg-[#1a2a46] border border-white/10 rounded-lg py-3.5 pl-12 pr-4 text-white text-sm placeholder-[#8fa0dd]/50 outline-none focus:border-white/20 transition-colors"
                />
              </div>
              <Button className="flex items-center gap-2 bg-[#36dd61] text-[#050a14] border-none rounded-lg px-6 font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer">
                <Search size={16} />
                <span>Search</span>
              </Button>
            </div>
          </DialogHeader>

          {/* List Display Section */}
          <div className="flex flex-col">
            <h3 className="text-[#8fa0dd]/60 text-xs font-medium uppercase tracking-wider mb-4">
              Trending assets
            </h3>

            <div className="flex flex-col gap-1 max-h-87.5 overflow-y-auto subtle-scrollbar">
              {trendingCoins?.length &&
                trendingCoins.map((asset) => (
                  <div
                    key={asset.item.id}
                    className="flex justify-between items-center px-4 py-3 rounded-lg hover:bg-[#1a2a46] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-base text-white shrink-0`}
                      >
                        <Image
                          src={asset.item.thumb}
                          alt="token icon"
                          width={32}
                          height={32}
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-medium text-sm">
                          {asset.item.id}
                        </span>
                        <span className="text-[#8fa0dd]/60 text-sm">
                          ({asset.item.symbol})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 min-w-40 justify-between">
                      <span
                        className={cn(
                          `flex items-center gap-1 text-sm font-medium w-20 justify-end`,
                          `${
                            asset.item.data.price_change_percentage_24h.usd >= 0
                              ? "text-[#10b981]"
                              : "text-[#ef4444]"
                          }`,
                        )}
                      >
                        {asset.item.data.price_change_percentage_24h.usd >=
                        0 ? (
                          <TrendingUp size={14} />
                        ) : (
                          <TrendingDown size={14} />
                        )}
                        {formatPercentage(
                          asset.item.data.price_change_percentage_24h.usd,
                        )}
                      </span>
                      <span className="text-white font-medium text-sm">
                        {formatCurrency(asset.item.data.price)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
