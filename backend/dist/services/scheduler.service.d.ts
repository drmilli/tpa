declare class SchedulerService {
    private jobs;
    private timers;
    constructor();
    private registerJobs;
    addJob(name: string, interval: number, handler: () => Promise<void>): void;
    start(): Promise<void>;
    runJob(name: string): Promise<void>;
    stop(): void;
    getJobStatus(): Array<{
        name: string;
        lastRun: Date | null;
        isRunning: boolean;
        interval: number;
    }>;
}
export declare const schedulerService: SchedulerService;
export {};
//# sourceMappingURL=scheduler.service.d.ts.map