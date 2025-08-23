import axios from "axios";

export async function getCoinHistory(coinId: string, days: number = 7) {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`;

  const response = await axios.get(url, {
    params: {
      vs_currency: "usd",
      days: days,
      interval: "daily",
    },
  });

  return response.data.prices;
}
