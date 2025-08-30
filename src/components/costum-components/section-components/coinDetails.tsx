import { CryptoCoin } from "@/types/coinType";
import React from "react";

type Props = {
  coin: CryptoCoin;
};

function CoinDetails({ coin }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-neutral-300 mb-6">
      <div className="bg-[#1f1f1f] p-4 rounded-md">
        <p className="text-xs text-neutral-500 mb-1">Market Cap</p>
        <p className="font-medium">${coin.market_cap?.toLocaleString()}</p>
      </div>
      <div className="bg-[#1f1f1f] p-4 rounded-md">
        <p className="text-xs text-neutral-500 mb-1">24h Volume</p>
        <p className="font-medium">${coin.total_volume?.toLocaleString()}</p>
      </div>
      <div className="bg-[#1f1f1f] p-4 rounded-md">
        <p className="text-xs text-neutral-500 mb-1">24h High</p>
        <p className="font-medium">${coin.high_24h?.toFixed(2)}</p>
      </div>
      <div className="bg-[#1f1f1f] p-4 rounded-md">
        <p className="text-xs text-neutral-500 mb-1">24h Low</p>
        <p className="font-medium">${coin.low_24h?.toFixed(2)}</p>
      </div>
      <div className="bg-[#1f1f1f] p-4 rounded-md">
        <p className="text-xs text-neutral-500 mb-1">All Time High</p>
        <p className="font-medium">
          ${coin.ath?.toFixed(2)} (
          {coin.ath_date ? new Date(coin.ath_date).toLocaleDateString() : "N/A"}
          )
        </p>
      </div>
      <div className="bg-[#1f1f1f] p-4 rounded-md">
        <p className="text-xs text-neutral-500 mb-1">All Time Low</p>
        <p className="font-medium">
          ${coin.atl?.toFixed(2)} (
          {coin.atl_date ? new Date(coin.atl_date).toLocaleDateString() : "N/A"}
          )
        </p>
      </div>
    </div>
  );
}

export default CoinDetails;
