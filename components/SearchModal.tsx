"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { fetcher } from "@/lib/coingecko.actions";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CryptoSearchModal() {
  const [searchToken, setSearchToken] = useState("");
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[] | null>(
    null,
  );
  const pathName = usePathname();

  const [coinList, setCoinList] = useState<CoinListData[] | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeButtonRef.current?.click();
  }, [pathName]);

  useEffect(() => {
    const getTrendingCoins = async () => {
      const { coins: tCoins } = await fetcher<{ coins: TrendingCoin[] }>(
        "/search/trending",
        undefined,
      );
      setTrendingCoins(tCoins);
    };
    getTrendingCoins();

    const getCoinList = async () => {
      const coins = await fetcher<CoinListData[]>("/coins/list", undefined);
      setCoinList(coins);
    };
    getCoinList();
  }, []);

  const handleSearchToken = async () => {
    const filteredCoins = coinList?.filter((coin) => {
      return coin.name.toUpperCase().includes(searchToken.toUpperCase());
    });

    let coinNames: string;
    if (filteredCoins?.length && filteredCoins?.length < 100) {
      coinNames = filteredCoins?.map((coin) => coin.name).join(",");
    } else {
      coinNames = filteredCoins
        ?.slice(0, 100)
        ?.map((coin) => coin.name)
        .join(",")!;
    }

    const newCoins = await fetcher<CoinMarketData[]>("/coins/markets", {
      vs_currency: "usd",
      names: coinNames,
    });

    setTrendingCoins(
      newCoins
        .sort((a, b) => b.current_price - a.current_price)
        .map((coin) => {
          return {
            item: {
              id: coin.id,
              name: coin.name,
              market_cap_rank: coin.market_cap_rank,
              symbol: coin.symbol,
              thumb: coin.image,
              large: coin.image,
              data: {
                price: coin.current_price,
                price_change_percentage_24h: {
                  usd: coin.price_change_percentage_24h,
                },
              },
            },
          };
        }),
    );
  };

  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger
          render={
            <Button className="px-5 py-2.5 bg-green-500 text-gray-900 font-semibold rounded-lg text-sm shadow-lg cursor-pointer hover:bg-green-400 hover:text-amber-50">
              Search
            </Button>
          }
        ></DialogTrigger>

        <DialogContent
          showCloseButton={false}
          className="sm:max-w-160 bg-[#121c2e] border-white/5 p-6 max-md:px-4 shadow-2xl rounded-xl gap-0 text-white"
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
                  placeholder="Search for a token by name"
                  value={searchToken}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchToken(e.target.value)
                  }
                  className="w-full bg-[#1a2a46] border border-white/10 rounded-lg py-3.5 pl-12 pr-4 text-white text-sm placeholder-[#8fa0dd]/50 outline-none focus:border-white/20 transition-colors"
                />
              </div>
              <Button
                className="flex items-center gap-2 bg-[#36dd61] text-[#050a14] border-none rounded-lg px-6 font-semibold  hover:text-gray-200 hover:bg-gray-700 text-sm transition-opacity cursor-pointer"
                onClick={handleSearchToken}
              >
                <Search size={16} />
                <span>Search</span>
              </Button>
            </div>
          </DialogHeader>
          <DialogClose
            render={
              <Button
                className="hidden"
                type="button"
                ref={closeButtonRef}
              ></Button>
            }
          />

          {/* List Display Section */}
          <div className="flex flex-col scrollbar-none overflow-auto">
            {trendingCoins?.length && (
              <>
                <h3 className="text-[#8fa0dd]/60 text-xs font-medium uppercase tracking-wider mb-4">
                  Trending assets
                </h3>
                <div className="flex flex-col max-[425px]:pr-1! max-sm:pr-1.5 sm:pr-2 gap-1 max-h-87.5 overflow-y-scroll subtle-scrollbar scrollbar-thin [scrollbar-color:#999_transparent]">
                  {trendingCoins.map((asset) => (
                    <Link href={`/coins/${asset.item.id}`} key={asset.item.id}>
                      <div
                        key={asset.item.id}
                        className="flex justify-between items-center px-3 py-3 max-sm:p-1 max-xl:px-1 max-xl:py-2 max-[425px]:px-0!  max-[425px]:justify-start  max-[425px]:gap-1.5 rounded-lg hover:bg-[#1a2a46] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5 max-[425px]:gap-1.5 ">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-base text-white shrink-0`}
                          >
                            <Image
                              src={asset.item.thumb}
                              alt="token icon"
                              width={28}
                              height={32}
                            />
                          </div>
                          <div className="flex items-center gap-1.5 max-md:flex-col max-md:items-start max-md:gap-0.5 max-[425px]:w-[clamp(80px,min(140px,30vw),160px)]! max-sm:w-[min(30vw,250px)] max-lg:w-[min(40vw,350px)] max-2xl:w-[min(25vw,250px)] 2xl:w-[min(30vw,350px)]">
                            <p className="text-white font-medium text-sm  max-[425px]:text-[14px] md:w-max">
                              {asset.item.id}
                              <span className="text-[#8fa0dd]/60 text-sm max-[425px]:text-[14px] ml-2">
                                ({asset.item.symbol})
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 min-w-40 justify-between max-[425px]:ml-auto max-[425px]:gap-2  max-[425px]:min-w-max">
                          <span
                            className={cn(
                              `flex items-center gap-1 text-sm font-medium w-20 justify-end  max-[425px]:text-xs`,
                              `${
                                asset.item.data.price_change_percentage_24h
                                  .usd >= 0
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
                          <span className="text-white font-medium text-sm  max-[425px]:text-xs">
                            {asset.item.data.price < 0.001
                              ? "> $0.001"
                              : formatCurrency(asset.item.data.price)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
