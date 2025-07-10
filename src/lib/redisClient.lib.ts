import { Queue, Worker } from 'bullmq';
import dotenv from "dotenv"
dotenv.config();
const redisConnection = {
  host: process.env.REDIS_SERVER_IP as string,
  port: Number(process.env.REDIS_PORT),
};

export { redisConnection, Queue, Worker };