const { parentPort, workerData } = require('worker_threads')

function getNthTermOfFib(n) {
  if (n < 1) return 0;

  if (n <= 2) return 1;

  return getNthTermOfFib(n - 2) + getNthTermOfFib(n - 1);
}

// if main thread using the workerOptions
// const term = getNthTermOfFib(workerData.iterations);
// parentPort.postMessage(term);

// if main thread using postMessage
parentPort.on('message', (n) => {
    console.log('executing worker');
    const term = getNthTermOfFib(n);

    parentPort.postMessage(term);
});