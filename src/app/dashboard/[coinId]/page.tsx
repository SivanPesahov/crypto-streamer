import { getRealtimeData } from "@/lib/getRealtimeData";
import CoinChart from "@/components/CoinChart";
import { getStoredCoinHistory } from "@/services/getStoredCoinHistory";

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
      <h1 className="text-3xl font-semibold mb-4">
        {coin.name} ({coin.symbol.toUpperCase()})
      </h1>
      <p className="text-neutral-300 mb-2">
        Current Price: ${coin.current_price.toFixed(2)}
      </p>
      <p
        className={`mb-4 ${
          coin.price_change_percentage_24h >= 0
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        24h Change: {coin.price_change_percentage_24h.toFixed(2)}%
      </p>
      <CoinChart prices={coinHistory} />
    </>
  );
}
