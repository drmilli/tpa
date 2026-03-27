"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const notFoundHandler_1 = require("./middleware/notFoundHandler");
const routes_1 = __importDefault(require("./routes"));
const logger_1 = require("./utils/logger");
const redis_1 = require("./config/redis");
const elasticsearch_1 = require("./config/elasticsearch");
const scheduler_service_1 = require("./services/scheduler.service");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || 'v1';
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true
}));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined', { stream: { write: message => logger_1.logger.info(message.trim()) } }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});
// API Routes
app.use(`/api/${API_VERSION}`, routes_1.default);
// 404 Handler
app.use(notFoundHandler_1.notFoundHandler);
// Error Handler
app.use(errorHandler_1.errorHandler);
// Start Server
const startServer = async () => {
    try {
        // Connect to Redis (optional - continues if unavailable)
        await (0, redis_1.connectRedis)();
        // Connect to Elasticsearch (optional - continues if unavailable)
        await (0, elasticsearch_1.connectElasticsearch)();
        const HOST = '0.0.0.0';
        app.listen(Number(PORT), HOST, () => {
            logger_1.logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
            logger_1.logger.info(`📡 API available at http://localhost:${PORT}/api/${API_VERSION}`);
            // Start scheduler in production
            if (process.env.NODE_ENV === 'production' || process.env.ENABLE_SCHEDULER === 'true') {
                scheduler_service_1.schedulerService.start().catch(err => {
                    logger_1.logger.error('Failed to start scheduler:', err);
                });
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map