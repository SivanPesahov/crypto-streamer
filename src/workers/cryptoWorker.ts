import { connectRabbitMQ } from "../lib/rabbitmq";

async function startWorker() {
  const { connection, channel } = await connectRabbitMQ();
  const queue = "crypto-data";

  await channel.assertQueue(queue, { durable: false });

  console.log(`👷 Worker listening on queue "${queue}"...`);

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const content = msg.content.toString();
      const parsed = JSON.parse(content);

      console.log("📩 Received message from queue:", parsed);

      channel.ack(msg);
    }
  });
}

startWorker().catch((err) => {
  console.error("Worker error:", err);
  process.exit(1);
});
