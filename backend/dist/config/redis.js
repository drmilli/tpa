"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectRedis = exports.isRedisConnected = exports.getRedisClient = exports.connectRedis = void 0;
const redis_1 = require("redis");
const logger_1 = require("../utils/logger");
let redisClient = null;
let isConnected = false;
const connectRedis = async () => {
    if (process.env.REDIS_ENABLED === 'false') {
        logger_1.logger.warn('⚠️ Redis disabled via REDIS_ENABLED=false');
        return;
    }
    try {
        redisClient = (0, redis_1.createClient)({
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
            logger_1.logger.info('✅ Connected to Redis');
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
    }
    catch (error) {
        logger_1.logger.warn('⚠️ Redis not available, running without cache:', error.message);
        if (redisClient) {
            try {
                await redisClient.disconnect();
            }
            catch {
                // Ignore disconnect errors
            }
        }
        redisClient = null;
    }
};
exports.connectRedis = connectRedis;
const getRedisClient = () => redisClient;
exports.getRedisClient = getRedisClient;
const isRedisConnected = () => isConnected && redisClient !== null;
exports.isRedisConnected = isRedisConnected;
const disconnectRedis = async () => {
    if (redisClient && isConnected) {
        await redisClient.quit();
    }
};
exports.disconnectRedis = disconnectRedis;
//# sourceMappingURL=redis.js.map