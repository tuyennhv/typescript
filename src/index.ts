import {Worker} from "worker_threads";
import {join} from "node:path";
import { heavyOperationLastingOneSecond } from "./util/util";
import { BYE_MESSAGE, HI_MESSAGE_BUSY } from "./util/const";

const worker = new Worker(join(__dirname, 'worker.js'));
let interval: NodeJS.Timeout;

worker.on('message', (message) => {
  console.log(`Received message from worker: ${message}`);
  if (message === HI_MESSAGE_BUSY) {
    interval = setInterval(() => {
      heavyOperationLastingOneSecond();
    }, 3000);
  } else if (message === BYE_MESSAGE) {
    clearInterval(interval);
    console.log('Stopped Interval');
  }
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


