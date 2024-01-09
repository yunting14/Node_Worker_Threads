const { Worker } = require("worker_threads");

// split array into equal chunks so different workers can work on different chunks
function chunkify(array, n) {
  let chunks = [];
  for (let i = n; i > 0; i--) {
    chunks.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return chunks;
}

function run(jobs, concurrentWorkers) {
  const chunks = chunkify(jobs, concurrentWorkers);
  let completedWorkers = 0;

  const tick = performance.now();

  chunks.forEach((data, i) => {
    // instantiate a new worker for each chunk
    const worker = new Worker("./worker.js");

    // pass the chunk of jobs to the worker
    worker.postMessage(data);

    // listen to message from worker
    worker.on("message", (msg) => {
      console.log(msg);
      console.log(`Worker ${i} completed`);
      completedWorkers++;
      if (completedWorkers === concurrentWorkers) {
        const tock = performance.now();
        console.log(`${concurrentWorkers} workers took ${tock - tick} ms`);
        process.exit();
      }
    });
  });
}

function doFib(n) {
  return new Promise((resolve) => {
    const start = performance.now();
    const worker = new Worker("./fib.js");
    worker.postMessage(n); // if not passing workerData through workerOptions

    worker.on("message", (data) => {
      resolve(data);
      const end = performance.now();
      console.log(`doFib completed in ${end - start}ms`);
    });
  });
}

async function runFib(n) {
  const start = performance.now();
  const values = await Promise.all([
    doFib(n),
    doFib(n),
    doFib(n),
    doFib(n),
    doFib(n),
    doFib(n),
    doFib(n),
    doFib(n),
    doFib(n),
    doFib(n),
  ]);
  console.log(`values: ${values}`);
  const end = performance.now();
  console.log(`Fib completed in ${end - start}ms`);
  process.exit();
}

function workersCanShareData(arr, concurrentWorkers) {
  let count = 0;
  console.log("Array before:", arr);
  for (let i = 0; i < concurrentWorkers; i++) {
    const worker = new Worker("./modify");
    worker.postMessage(arr);
    worker.on("message", (message) => {
      console.log(message);
      worker.terminate();
      count++;
      if (count === concurrentWorkers) {
        console.log("Array after:", arr);
      }
    });
  }
}

/* RUN */

const jobs = Array.from({ length: 100 }, () => 1e9);
// run(jobs, 16); // max: 8

// runFib(40);

const arr = new Array();
// cannot pass objects between node processes/threads... need
workersCanShareData(obj, 1);

