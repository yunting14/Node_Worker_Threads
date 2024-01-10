import { Worker, Queue } from "bullmq";
import config from "./config";
import { webhooksWorker } from "./webhookWorker";

const webhooksQueue = new Queue('webhooks', { connection: config.redisConnection });

// new Worker(queue_name, processor_that_performs_job)
export const taskWorker = new Worker<{userId: string, task: any}>(
    'tasks',
    async (job) => {
        console.log(`Processing job ${job.id} or type ${job.name}`);
        
        const result = `Result data from task performed for ${job.name} with ID ${job.id}`;

        // return value of Worker listened on "completed"
        return webhooksQueue.add(
            job.name, 
            {userId: job.data.userId, result},
            {
                attempts: config.maxAttempts,
                backoff: {type: 'exponential', delay: config.backoffDelay}
            }    
        );
    },
    {connection: config.redisConnection}   
);

webhooksWorker
.on('progress', (job, progress: any) => {
  console.log(`Webhook worker activated. Job with ID ${job.id} in progress`);
})
.on('failed', (job, error) => {
  console.log(`Webhook worker failed (Job ID: ${job!.id}). Error: ${error.message}`);
})
.on('completed', (job, result) => {
  console.log(`Webhook worker for Job ID ${job.id} completed.`);
})
.on('error', (error) => {
  console.log(`Error occured for webhook worker. Error: ${error}`);
});