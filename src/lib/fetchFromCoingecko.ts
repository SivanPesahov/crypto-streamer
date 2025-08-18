import axios from "axios";

export async function fetchFromCoingecko() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: { vs_currency: "usd" },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      `Coingecko API error: ${
        (error as any)?.response?.statusText || "Unknown error"
      }`
    );
  }
}
