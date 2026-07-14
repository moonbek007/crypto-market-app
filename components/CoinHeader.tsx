import Image from "next/image";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { cn, formatCurrency, formatPercentage } from "@/lib/utils";

const CoinHeader = ({
  priceChangePercentage24h,
  priceChangePercentage30d,
  name,
  image,
  currentPrice,
  marketCapRank,
}: CoinHeaderProps) => {
  const isTrendingUp = priceChangePercentage24h > 0;
  const isThirtyDayUp = priceChangePercentage30d > 0;

  const stats = [
    {
      label: "Today",
      value: priceChangePercentage24h,
      isUp: isTrendingUp,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: "30 Days",
      value: priceChangePercentage30d,
      isUp: isThirtyDayUp,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: "Market Cap Rank",
      value: marketCapRank,
      isUp: null,
      formatter: null,
      showIcon: false,
    },
  ];

  return (
    <div id="coin-header">
      <h3>{name}</h3>

      <div className="info">
        <Image src={image} alt={name} width={77} height={77} />

        <div className="price-row">
          <h1>{formatCurrency(currentPrice)}</h1>
          <Badge
            className={cn("badge", isTrendingUp ? "badge-up" : "badge-down")}
            render={<></>}
          >
            {formatPercentage(priceChangePercentage24h)}
            {isTrendingUp ? <TrendingUp /> : <TrendingDown />}
          </Badge>
        </div>
      </div>

      <ul className="stats">
        {stats.map((stat) => (
          <li key={stat.label}>
            <p className="label">{stat.label}</p>

            <div
              className={cn("value", {
                "text-green-500": stat.showIcon && stat.isUp,
                "text-red-500": stat.showIcon && !stat.isUp,
              })}
            >
              <p>{stat.formatter ? stat.formatter(stat.value) : stat.value}</p>
              {stat.showIcon &&
                (stat.isUp ? (
                  <TrendingUp width={16} height={16} />
                ) : (
                  <TrendingDown width={16} height={16} />
                ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default CoinHeader;
