// parentPort is used to receive the data/messages from the main thread
const { parentPort } = require("worker_threads");

parentPort.on("message", (jobs) => {

  for (let job of jobs) {
    let count = 0;
    for (let i = 0; i < job; i++) {
      count++;
    }
  }

  // notify main thread when work is done or: process.exit()
  parentPort.postMessage('done');

});
