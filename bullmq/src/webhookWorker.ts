import { Worker, Queue } from "bullmq";
import config from "./config";
import axios from 'axios';

const mailQueue = new Queue('mailbot', {connection: config.redisConnection});

export const webhooksWorker = new Worker<{userId: string; result: string}>(
    'webhooks',
    async (job) => {
        const {userId, result} = job.data;

        const maxWebhookAttempts = config.maxAttempts - config.maxAttemptsForEmail;
        if (job.attemptsMade < maxWebhookAttempts){
            console.log(`Calling webhook for ${result}, attempt ${job.attemptsMade+1} of ${maxWebhookAttempts}`);
            const response = await axios.post(`http://localhost:${config.userPort}/${userId}`, {result});
            return response.data;
        } else {
            console.log(`Giving up, webhook to notify user not working for ${result}`);
        }
    },
    {connection: config.redisConnection}
);