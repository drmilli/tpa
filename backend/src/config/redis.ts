import { createClient } from 'redis';
import { logger } from '../utils/logger';

type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;
let isConnected = false;

export const connectRedis = async () => {
  if (process.env.REDIS_ENABLED === 'false') {
    logger.warn('⚠️ Redis disabled via REDIS_ENABLED=false');
    return;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: false,
      },
    });

    redisClient.on('error', () => {
      // Silently handle - we log when connection fails
    });

    redisClient.on('connect', () => {
      isConnected = true;
      logger.info('✅ Connected to Redis');
    });

    redisClient.on('end', () => {
      isConnected = false;
    });

    // Race between connect and timeout
    const connectPromise = redisClient.connect();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Redis connection timeout')), 5000);
    });

    await Promise.race([connectPromise, timeoutPromise]);
  } catch (error) {
    logger.warn('⚠️ Redis not available, running without cache:', (error as Error).message);
    if (redisClient) {
      try {
        await redisClient.disconnect();
      } catch {
        // Ignore disconnect errors
      }
    }
    redisClient = null;
  }
};

export const getRedisClient = () => redisClient;

export const isRedisConnected = () => isConnected && redisClient !== null;

export const disconnectRedis = async () => {
  if (redisClient && isConnected) {
    await redisClient.quit();
  }
};
