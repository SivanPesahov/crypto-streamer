import { connectRabbitMQ } from "./rabbitmq";

export async function publishToQueue(
  queueName: string,
  message: any,
  durable = true
) {
  const { connection, channel } = await connectRabbitMQ();

  await channel.assertQueue(queueName, { durable });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));

  console.log(`📤 Message sent to queue "${queueName}"`);

  await channel.close();
  await connection.close();
}
