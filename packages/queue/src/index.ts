import { Queue, Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_QUEUE_URL || process.env.REDIS_URL || "redis://localhost:6379/2", {
  maxRetriesPerRequest: null,
});

// Email Queue
export const emailQueue = new Queue("email", { connection });

// Image Processing Queue
export const imageQueue = new Queue("image-processing", { connection });

// Webhook Queue
export const webhookQueue = new Queue("webhook", { connection });

// Queue Events
export const queueEvents = new QueueEvents("email", { connection });

// Job Processors
export const processors = {
  async sendEmail(job: any) {
    const { to, subject, html, text } = job.data;
    
    // Use Resend or your email service
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email failed: ${response.statusText}`);
    }

    return response.json();
  },

  async processImage(job: any) {
    const { imageUrl, operations } = job.data;
    
    // Image processing logic (resize, optimize, watermark)
    // Use Sharp or similar library
    return { processedUrl: imageUrl };
  },

  async sendWebhook(job: any) {
    const { url, payload, headers } = job.data;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }

    return response.json();
  },
};

// Worker
export const worker = new Worker(
  "email",
  async (job) => {
    switch (job.name) {
      case "send-email":
        return processors.sendEmail(job);
      case "process-image":
        return processors.processImage(job);
      case "send-webhook":
        return processors.sendWebhook(job);
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
