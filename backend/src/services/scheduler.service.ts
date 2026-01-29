import { scoringService } from './scoring.service';
import { logger } from '../utils/logger';

interface ScheduledJob {
  name: string;
  interval: number; // in milliseconds
  lastRun: Date | null;
  isRunning: boolean;
  handler: () => Promise<void>;
}

class SchedulerService {
  private jobs: Map<string, ScheduledJob> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.registerJobs();
  }

  private registerJobs(): void {
    // Update scores every 6 hours
    this.addJob('updateScores', 6 * 60 * 60 * 1000, async () => {
      logger.info('Running scheduled score update...');
      await scoringService.updateAllScores();
    });

    // Update rankings every 12 hours
    this.addJob('updateRankings', 12 * 60 * 60 * 1000, async () => {
      logger.info('Running scheduled ranking update...');
      await scoringService.updateRankings();
    });
  }

  addJob(name: string, interval: number, handler: () => Promise<void>): void {
    this.jobs.set(name, {
      name,
      interval,
      lastRun: null,
      isRunning: false,
      handler,
    });
  }

  async start(): Promise<void> {
    logger.info('Starting scheduler service...');

    for (const [name, job] of this.jobs) {
      // Run immediately on start
      this.runJob(name);

      // Schedule recurring runs
      const timer = setInterval(() => this.runJob(name), job.interval);
      this.timers.set(name, timer);

      logger.info(`Scheduled job "${name}" to run every ${job.interval / 1000 / 60} minutes`);
    }
  }

  async runJob(name: string): Promise<void> {
    const job = this.jobs.get(name);
    if (!job) {
      logger.warn(`Job "${name}" not found`);
      return;
    }

    if (job.isRunning) {
      logger.warn(`Job "${name}" is already running, skipping...`);
      return;
    }

    job.isRunning = true;
    const startTime = Date.now();

    try {
      await job.handler();
      job.lastRun = new Date();
      logger.info(`Job "${name}" completed in ${Date.now() - startTime}ms`);
    } catch (error) {
      logger.error(`Job "${name}" failed:`, error);
    } finally {
      job.isRunning = false;
    }
  }

  stop(): void {
    logger.info('Stopping scheduler service...');
    for (const [name, timer] of this.timers) {
      clearInterval(timer);
      logger.info(`Stopped job "${name}"`);
    }
    this.timers.clear();
  }

  getJobStatus(): Array<{ name: string; lastRun: Date | null; isRunning: boolean; interval: number }> {
    return Array.from(this.jobs.values()).map(job => ({
      name: job.name,
      lastRun: job.lastRun,
      isRunning: job.isRunning,
      interval: job.interval,
    }));
  }
}

export const schedulerService = new SchedulerService();
