import CoinHeader from "@/components/CoinHeader";
import Converter from "@/components/Converter";

import { fetcher } from "@/lib/coingecko.actions";

const Page = async ({ params }: NextPageProps) => {
  const { id } = await params;

  const [coinData] = await fetcher<CoinMarketData[]>(`/coins//markets`, {
    vs_currency: "usd",
    ids: id,
    price_change_percentage: "24h,30d",
  });

  const coinPrice = await fetcher<CoinPriceData>(`/simple//price`, {
    vs_currencies: "usd,eur,gbp",
    ids: id,
  });

  return (
    <main id="coin-details-page">
      <section className="primary">
        <CoinHeader
          name={coinData.name}
          image={coinData.image}
          marketCapRank={coinData.market_cap_rank}
          currentPrice={coinData.current_price}
          priceChangePercentage24h={coinData.price_change_percentage_24h}
          priceChangePercentage30d={
            coinData.price_change_percentage_30d_in_currency
          }
        />
      </section>
      <section className="secondary">
        <Converter
          symbol={coinData.symbol}
          icon={coinData.image}
          priceList={coinPrice[id]}
        />
      </section>
    </main>
  );
};
export default Page;
