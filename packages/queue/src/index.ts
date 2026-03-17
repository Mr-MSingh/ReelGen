import { Queue } from "bullmq";
import IORedis from "ioredis";

export const QUEUE_NAMES = {
  generation: "reelgen:jobs",
  publishing: "reelgen:publishing",
};

export function createRedisConnection() {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  return new IORedis(redisUrl, { maxRetriesPerRequest: null });
}

export function createGenerationQueue() {
  return new Queue(QUEUE_NAMES.generation, {
    connection: createRedisConnection(),
  });
}

export function createPublishingQueue() {
  return new Queue(QUEUE_NAMES.publishing, {
    connection: createRedisConnection(),
  });
}
