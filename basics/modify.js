const { workerData, parentPort } = require('worker_threads');

function addItem(arr) {
    arr.push(1);
}

parentPort.on('message', (arr) => {
    addItem(arr);
    parentPort.postMessage('done');
});
