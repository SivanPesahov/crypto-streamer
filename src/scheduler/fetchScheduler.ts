import cron from "node-cron";
import axios from "axios";

cron.schedule("* * * * *", async () => {
  try {
    console.log("⏱  Running scheduled fetch...");
    const response = await axios.get("http://localhost:3000/api/crypto/fetch");
    console.log("✅ Fetch completed", response.data);
  } catch (error) {
    console.error("❌ Error in scheduled fetch:", error);
  }
});
