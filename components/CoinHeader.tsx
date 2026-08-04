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
      <h3 className="text-amber-50 max-sm:text-2xl">{name}</h3>

      <div className="info">
        <Image src={image} alt={name} width={77} height={77} />

        <div className="price-row">
          <h1 className="text-white max-sm:text-2xl">
            {formatCurrency(currentPrice)}
          </h1>
          <Badge
            className={cn("badge", "max-sm:mt-0", {
              "badge-up text-green-500": isTrendingUp,
              "badge-down text-red-500": !isTrendingUp,
            })}
            render={<></>}
          >
            <span
              className={cn("badge p-1 bg-transparent", {
                "badge-up": isTrendingUp,
                "badge-down": !isTrendingUp,
              })}
            >
              {formatPercentage(priceChangePercentage24h)}
            </span>
            {isTrendingUp ? (
              <TrendingUp className="text-green-400 max-sm:self-center" />
            ) : (
              <TrendingDown className="text-red-500  max-sm:self-center" />
            )}
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
                "text-gray-200": !stat.showIcon,
              })}
            >
              <p>
                {stat.formatter
                  ? stat.formatter(stat.value)
                  : stat.value
                    ? stat.value
                    : "-"}
              </p>
              {stat.showIcon &&
                (stat.isUp ? (
                  <TrendingUp
                    width={16}
                    height={16}
                    className="max-sm:self-center"
                  />
                ) : (
                  <TrendingDown
                    width={16}
                    height={16}
                    className="max-sm:self-center"
                  />
                ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default CoinHeader;
