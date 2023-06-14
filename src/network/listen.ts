import { parentPort } from 'worker_threads';
import { createServer, Socket } from 'net';
import { BYE_MESSAGE, HI_MESSAGE, HI_MESSAGE_BUSY, PORT } from '../util/const';

export async function listen(): Promise<void> {
  const counter = new Counter();

  return new Promise<void>((resolve, reject) => {
    const server = createServer((socket: Socket) => {
      console.log('Client connected');

      socket.on('data', (data) => {
        const message = data.toString();
        if (message === HI_MESSAGE || message === HI_MESSAGE_BUSY) {
          counter.start();
          parentPort?.postMessage(message);
        } else if (message === BYE_MESSAGE) {
          counter.finish();
          parentPort?.postMessage(BYE_MESSAGE);
        } else {
          counter.track(message);
        }
          // socket.write('Data received');
      });

      socket.on('end', () => {
          console.log('Client disconnected');
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


class Counter {
  private totalMessage = 0;
  private totalOnTimeMessage = 0;
  private total5msDelayMessage = 0;
  private isStarted = false;

  public start(): void {
    this.isStarted = true;
  }

  public track(timestamp: string): void {
    const message = parseInt(timestamp);
    const now = Date.now();
    if (this.isStarted) {
      if (now === message) {
        this.totalOnTimeMessage++;
      }
      if (Math.abs(message - now) <= 5) {
        this.total5msDelayMessage++;
      }
      this.totalMessage++;
    }
  }

  public finish(): void {
    console.log(`Total message: ${this.totalMessage}, total on time message: ${this.totalOnTimeMessage}, total 5ms delay message: ${this.total5msDelayMessage}`);
    this.isStarted = false;
    this.totalMessage = 0;
    this.totalOnTimeMessage = 0;
    this.total5msDelayMessage = 0;
    this.isStarted = false;
  }
}