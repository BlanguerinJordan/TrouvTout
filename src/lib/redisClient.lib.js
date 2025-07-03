import { Queue, Worker } from 'bullmq';
import dotenv from "dotenv"
dotenv.config();
const redisConnection = {
  host: process.env.REDIS_SERVER_IP,
  port: process.env.REDIS_PORT,
};

export { redisConnection, Queue, Worker };