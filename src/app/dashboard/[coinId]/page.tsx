import CoinChart from "@/components/costum-components/chart-components/coinChart";
import CoinDetails from "@/components/costum-components/section-components/coinDetails";
import { getRealtimeData } from "@/lib/redis/getRealtimeData";
import { getStoredCoinHistory } from "@/lib/sql/getStoredCoinHistory";

type Props = {
  params: {
    coinId: string;
  };
};

export default async function CoinPage({ params }: Props) {
  const { coinId } = await params;
  const realtimeData = await getRealtimeData();
  const coin = realtimeData?.find((c) => c.id === coinId);

  const coinHistory = await getStoredCoinHistory(coinId);

  if (!coin) {
    return <div className="p-6 text-red-600">Coin not found.</div>;
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-4 text-white">
        {coin.name} ({coin.symbol.toUpperCase()})
      </h1>

      <p className="text-xl text-neutral-300 mb-1">
        Current Price:{" "}
        <span className="font-medium text-white">
          ${coin.current_price.toFixed(2)}
        </span>
      </p>
      <p
        className={`text-md mb-6 font-medium ${
          coin.price_change_percentage_24h >= 0
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        24h Change: {coin.price_change_percentage_24h.toFixed(2)}%
      </p>

      <div className="bg-[#1a1a1a] rounded-lg p-4 shadow-md mb-8">
        <CoinChart prices={coinHistory} />
      </div>

      <CoinDetails coin={coin} />
    </>
  );
}
