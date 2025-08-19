import { getRealtimeData } from "@/lib/getRealtimeData";
import CoinChart from "@/components/CoinChart";

type Props = {
  params: {
    coinId: string;
  };
};

export default async function CoinPage({ params }: Props) {
  const realtimeData = await getRealtimeData();
  const coin = realtimeData?.find((c) => c.id === params.coinId);

  if (!coin) {
    return <div className="p-6 text-red-600">Coin not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {coin.name} ({coin.symbol.toUpperCase()})
      </h1>
      <p className="text-black mb-2">
        Current Price: ${coin.current_price.toFixed(2)}
      </p>
      <p
        className={`text-black ${
          coin.price_change_percentage_24h >= 0
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        24h Change: {coin.price_change_percentage_24h.toFixed(2)}%
      </p>
      <CoinChart
        current_price={coin.current_price}
        price_change_percentage_24h={coin.price_change_percentage_24h}
      />
    </div>
  );
}
