import Image from "next/image";
import { TrendingDown, TrendingUp } from "lucide-react";

import DataTable from "@/components/DataTable";
import { CategoriesFallback } from "./fallback";

import { fetcher } from "@/lib/coingecko.actions";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";

const Categories = async () => {
  let categories: Category[];
  let columns: DataTableColumn<Category>[];
  try {
    categories = await fetcher<Category[]>("/coins/categories");

    columns = [
      {
        header: "Category",
        cellClassName: "category-cell",
        cell: (category) => category.name,
      },
      {
        header: "Top Gainers",
        cellClassName: "top-gainers-cell",
        cell: (category) =>
          category.top_3_coins.map((coin) => (
            <Image src={coin} alt={coin} key={coin} width={28} height={28} />
          )),
      },
      {
        header: "24h Change",
        cellClassName: "change-header-cell",
        cell: (category) => {
          const isTrendingUp = category.market_cap_change_24h > 0;

          return (
            <div
              className={cn(
                "change-cell",
                isTrendingUp ? "text-green-500" : "text-red-500",
              )}
            >
              <p className="flex items-center">
                {formatPercentage(category.market_cap_change_24h)}
                {isTrendingUp ? (
                  <TrendingUp width={16} height={16} />
                ) : (
                  <TrendingDown width={16} height={16} />
                )}
              </p>
            </div>
          );
        },
      },
      {
        header: "Market Cap",
        cellClassName: "market-cap-cell",
        cell: (category) => formatCurrency(category.market_cap),
      },
      {
        header: "24h Volume",
        cellClassName: "volume-cell",
        cell: (category) => formatCurrency(category.volume_24h),
      },
    ];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return <CategoriesFallback />;
  }
  return (
    <div id="categories" className="custom-scrollbar">
      <h4 className="text-gray-50">Top Categories</h4>

      <DataTable
        columns={columns}
        data={categories?.slice(0, 10)}
        rowKey={(_, index) => index}
        tableClassName="mt-3"
      />
    </div>
  );
};

export default Categories;
