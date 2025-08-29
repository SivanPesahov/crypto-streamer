import cron from "node-cron";
import { fetchFromCoingecko } from "../lib/fetchFromCoingecko";
import { publishToQueue } from "../lib/publishToQueue";

let coins: any;

async function sendHistoryRequests() {
  let index = 0;
  const interval = setInterval(async () => {
    if (index >= coins.length) {
      console.log("✅ Done sending all coin history requests");
      clearInterval(interval);
      return;
    }

    const coin = coins[index];

    try {
      await publishToQueue("coin-history-request", {
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
      });
      console.log(`📤 Sent coin-history request for ${coin.id}`);
    } catch (err) {
      console.error(`❌ Failed to send request for ${coin.id}`, err);
    }

    index++;
  }, 60000);
}

async function main() {
  try {
    coins = await fetchFromCoingecko();
    await sendHistoryRequests();
  } catch (err) {
    console.error("❌ Error sending coin history requests", err);
  }
}

main();

cron.schedule("0 0 * * *", async () => {
  console.log("🕛 Scheduled task: Fetching coin history...");
  await main();
});
