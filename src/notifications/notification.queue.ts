import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const notificationQueue = new Queue('notifications', { connection });

export const notificationWorker = new Worker(
  'notifications',
  async job => {
    const { userId, title, message } = job.data;

    // Simple email template (simulation)
    const emailHTML = `
      <div style="font-family: Arial; padding: 15px;">
        <h2 style="color:#4F46E5;">🔔 ${title || 'New Notification'}</h2>
        <p>${message}</p>
        <hr/>
        <p style="font-size:12px;color:#777;">This is an automated message from DevSphere.</p>
      </div>
    `;

    console.log(`📧 Sending email to user ${userId}...`);
    console.log(emailHTML);

    return { sent: true };
  },
  { connection, concurrency: 5 },
);

notificationWorker.on('completed', job => {
  console.log(`[✅ Worker] Job ${job.id} completed.`);
});

notificationWorker.on('failed', (job, err) => {
  console.error(`[❌ Worker] Job ${job?.id} failed:`, err);
});
