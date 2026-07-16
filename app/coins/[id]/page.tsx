import CandlestickChart from "@/components/CandlestickChart";
import CoinHeader from "@/components/CoinHeader";
import Converter from "@/components/Converter";
import { Separator } from "@/components/ui/separator";

import { fetcher } from "@/lib/coingecko.actions";
import { formatCurrency } from "@/lib/utils";

const Page = async ({ params }: NextPageProps) => {
  const { id } = await params;

  const coinData = await fetcher<CoinDetailsData>(`/coins/${id}`, {
    vs_currency: "usd",
  });

  const coinPrice = await fetcher<CoinPriceData>(`/simple//price`, {
    vs_currencies: "usd,eur,gbp",
    ids: id,
  });

  const coinOHLCData = await fetcher<OHLCData[]>(`/coins/${id}/ohlc`, {
    vs_currency: "usd",
    days: 1,
    precision: "full",
  });

  const coinDetails = [
    {
      label: "Market Cap",
      value: formatCurrency(coinData.market_data.market_cap.usd),
    },
    {
      label: "Market Cap Rank",
      value: `# ${coinData.market_cap_rank}`,
    },
    {
      label: "Total Volume",
      value: formatCurrency(coinData.market_data.total_volume.usd),
    },
  ];

  return (
    <main id="coin-details-page">
      <section className="primary">
        <div>
          <CoinHeader
            name={coinData.name}
            image={coinData.image.large}
            marketCapRank={coinData.market_cap_rank}
            currentPrice={coinData.market_data.current_price.usd}
            priceChangePercentage24h={
              coinData.market_data.price_change_percentage_24h
            }
            priceChangePercentage30d={
              coinData.market_data.price_change_percentage_30d
            }
          />
          <Separator className="divider" />
          <div className="trend mt-10 md:flex-row">
            <CandlestickChart
              coinId={id}
              data={coinOHLCData}
              initialPeriod="daily"
            >
              <h4>Trend Overview</h4>
            </CandlestickChart>
          </div>
        </div>
        <div className="details">
          <h4>Coin Details</h4>

          <ul className="details-grid">
            {coinDetails.map(({ label, value }, index) => (
              <li key={index}>
                <p className={label}>{label}</p>
                <p className="text-base font-medium">{value || "-"}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="secondary">
        <Converter
          symbol={coinData.symbol}
          icon={coinData.image.small}
          priceList={coinPrice[id]}
        />
      </section>
    </main>
  );
};
export default Page;
