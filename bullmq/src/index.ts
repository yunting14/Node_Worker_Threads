import express from "express";
import { Queue } from "bullmq";
import config from "./config";
import { taskWorker } from "./taskWorker";

const app = express();

// new Queue(name_of_queue, redis_connection)
const taskQueue = new Queue("tasks", { connection: config.redisConnection });

app.get("/", (req, res) => {
  res.send("Hello! We are trying bullmq out.");
});

app.post("/users/:userId/tasks/:taskType", (req, res) => {
  const taskData = req.body;
  const taskType = req.params.taskType;
  const userId = req.params.userId;

  const jobPayload = {
    userId,
    taskData,
  };

  // add(job_name, payload)
  taskQueue
    .add(taskType, jobPayload)
    .then((job) => {
        res.status(201).end(job.id),
        (err:unknown) => {
            res.status(500).end(err);
        };
    });
});

console.log(`App started on http://localhost:${config.port}`);
app.listen(config.port);

// taskworker has will pick up jobs from the Queue with name "tasks"
taskWorker
.on('progress', (job, progress: any) => {
  console.log(`Task worker activated. Job with ID ${job.id} in progress`);
})
.on('failed', (job, error) => {
  console.log(`Task worker failed (Job ID: ${job!.id}). Error: ${error.message}`);
})
.on('completed', (job, result) => {
  console.log(`Task worker for Job ID ${job.id} completed. Result: ${result}`);
})
.on('error', (error) => {
  console.log(`Error occured for task worker. Error: ${error}`);
});


