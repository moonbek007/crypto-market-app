import { TrendingCoinsFallback } from "@/components/home/fallback";
import TrendingCoins from "@/components/home/TrendingCoins";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="main-container">
      <section className="home-grid">
        <p>CoinOverview</p>
        <Suspense fallback={<TrendingCoinsFallback />}>
          <TrendingCoins />
        </Suspense>
      </section>

      <section className="w-full mt-7 space-y-4">
        <p>Categories</p>
      </section>
    </main>
  );
}
