import { parentPort } from 'worker_threads';
import { createServer, Socket } from 'net';
import { BYE_MESSAGE, HI_MESSAGE, HI_MESSAGE_BUSY, HI_MESSAGES, PORT } from '../util/const';

type TestStatus = Status[];

export async function listen(): Promise<void> {
  let counter: Counter;
  let testStatuses: TestStatus[] = [];

  return new Promise<void>((resolve, reject) => {
    const server = createServer((socket: Socket) => {
      console.log('Client connected');

      socket.on('data', (data) => {
        const message = data.toString();
        if (message === HI_MESSAGE || message === HI_MESSAGE_BUSY) {
          counter = new Counter();
          counter.start();
          parentPort?.postMessage(message);
        } else if (message === BYE_MESSAGE) {
          testStatuses.push(counter.finish());
          parentPort?.postMessage(BYE_MESSAGE);
        } else {
          counter.track(message);
        }
      });

      socket.on('end', () => {
          console.log('Client disconnected');
          if (testStatuses.length === 0) {
            return;
          }

          const tabularData: Record<string, Record<number, number>> = {};
          for (const [index, status] of testStatuses.entries()) {
            const rowData: Record<number, number> = {};
            for (const {delta, total} of status) {
              rowData[delta] = total;
            }

            tabularData[HI_MESSAGES[index]] = rowData;
          }
          console.table(tabularData);
          testStatuses = [];
      });
    });

    server.listen(PORT, () => {
      console.log(`TCP server listening on port ${PORT}`);
      resolve();
    });

    server.on('error', (error) => {
      reject(error);
    });
  });
}

type Status = {
  delta: number;
  total: number;
}

class Counter {
  private isStarted = false;
  private statuses: Status[] = defaultStatuses();

  public start(): void {
    this.isStarted = true;
  }

  public track(timestamp: string): void {
    const message = parseInt(timestamp);
    const now = Date.now();
    if (this.isStarted) {
      for (const status of this.statuses) {
        if (Math.abs(message - now) <= status.delta) {
          status.total++;
        }
      }
    }
  }

  public finish(): Status[] {
    this.isStarted = false;
    const result = this.statuses;
    this.statuses = defaultStatuses();
    return result;
  }
}

function defaultStatuses(): Status[] {
  return [
    {delta: 0, total: 0},
    {delta: 1, total: 0},
    {delta: 2, total: 0},
    {delta: 5, total: 0},
    {delta: 20, total: 0},
    {delta: 50, total: 0},
    // assume no message will be received after 1s
    {delta: 1000, total: 0},
  ];
}