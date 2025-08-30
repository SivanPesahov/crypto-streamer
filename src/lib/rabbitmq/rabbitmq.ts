import amqplib from "amqplib";

const RABBITMQ_URL = "amqp://localhost";

export async function connectRabbitMQ() {
  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  return { connection, channel };
}
