import * as schedule from 'node-schedule';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const runEveryMinute = (f: () => any): void => {
  const rule = new schedule.RecurrenceRule();
  rule.minute = new schedule.Range(0, 59, 1);
  schedule.scheduleJob(rule, () => {
    f();
  });
};

export const stopJobs = (): void => {
  const jobs = schedule.scheduledJobs;
  if (jobs === undefined) {
    return;
  }
  Object.keys(jobs).map((job) => {
    schedule.cancelJob(job);
  });
};

export default runEveryMinute;
