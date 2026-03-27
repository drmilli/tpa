"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulerService = void 0;
const scoring_service_1 = require("./scoring.service");
const logger_1 = require("../utils/logger");
class SchedulerService {
    constructor() {
        this.jobs = new Map();
        this.timers = new Map();
        this.registerJobs();
    }
    registerJobs() {
        // Update scores every 6 hours
        this.addJob('updateScores', 6 * 60 * 60 * 1000, async () => {
            logger_1.logger.info('Running scheduled score update...');
            await scoring_service_1.scoringService.updateAllScores();
        });
        // Update rankings every 12 hours
        this.addJob('updateRankings', 12 * 60 * 60 * 1000, async () => {
            logger_1.logger.info('Running scheduled ranking update...');
            await scoring_service_1.scoringService.updateRankings();
        });
    }
    addJob(name, interval, handler) {
        this.jobs.set(name, {
            name,
            interval,
            lastRun: null,
            isRunning: false,
            handler,
        });
    }
    async start() {
        logger_1.logger.info('Starting scheduler service...');
        for (const [name, job] of this.jobs) {
            // Run immediately on start
            this.runJob(name);
            // Schedule recurring runs
            const timer = setInterval(() => this.runJob(name), job.interval);
            this.timers.set(name, timer);
            logger_1.logger.info(`Scheduled job "${name}" to run every ${job.interval / 1000 / 60} minutes`);
        }
    }
    async runJob(name) {
        const job = this.jobs.get(name);
        if (!job) {
            logger_1.logger.warn(`Job "${name}" not found`);
            return;
        }
        if (job.isRunning) {
            logger_1.logger.warn(`Job "${name}" is already running, skipping...`);
            return;
        }
        job.isRunning = true;
        const startTime = Date.now();
        try {
            await job.handler();
            job.lastRun = new Date();
            logger_1.logger.info(`Job "${name}" completed in ${Date.now() - startTime}ms`);
        }
        catch (error) {
            logger_1.logger.error(`Job "${name}" failed:`, error);
        }
        finally {
            job.isRunning = false;
        }
    }
    stop() {
        logger_1.logger.info('Stopping scheduler service...');
        for (const [name, timer] of this.timers) {
            clearInterval(timer);
            logger_1.logger.info(`Stopped job "${name}"`);
        }
        this.timers.clear();
    }
    getJobStatus() {
        return Array.from(this.jobs.values()).map(job => ({
            name: job.name,
            lastRun: job.lastRun,
            isRunning: job.isRunning,
            interval: job.interval,
        }));
    }
}
exports.schedulerService = new SchedulerService();
//# sourceMappingURL=scheduler.service.js.map