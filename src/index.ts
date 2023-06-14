import {Worker} from "worker_threads";
import {join} from "node:path";

const worker = new Worker(join(__dirname, 'worker.js'));

worker.on('message', (message) => {
  console.log(`Received message from worker: ${message}`);
});

worker.on('error', (error) => {
  console.error(`Worker encountered an error: ${error.message}`);
});

worker.on('exit', (code) => {
  if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
  }
});

console.log("Started worker thread")


