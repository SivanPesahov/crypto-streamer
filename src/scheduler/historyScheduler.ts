import cron from "node-cron";
import { fetchFromCoingecko } from "../lib/fetchFromCoingecko";
import { publishToQueue } from "../lib/publishToQueue";

let coins: string[] = [];

async function sendHistoryRequests() {
  let index = 0;
  const interval = setInterval(async () => {
    if (index >= coins.length) {
      console.log("✅ Done sending all coin history requests");
      clearInterval(interval);
      return;
    }

    const coinId = coins[index];
    try {
      await publishToQueue("coin-history-request", { coinId });
      console.log(`📤 Sent coin-history request for ${coinId}`);
    } catch (err) {
      console.error(`❌ Failed to send request for ${coinId}`, err);
    }

    index++;
  }, 60000);
}

async function main() {
  try {
    coins = (await fetchFromCoingecko()).map((coin: any) => coin.id);
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
