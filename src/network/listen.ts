import { parentPort } from 'worker_threads';
import { createServer, Socket } from 'net';
import { PORT } from '../util/const';

export async function listen(): Promise<void> {

  return new Promise<void>((resolve, reject) => {
    const server = createServer((socket: Socket) => {
      console.log('Client connected');

      socket.on('data', (data) => {
          console.log(`Received data from client: ${data}`);
          socket.write('Data received');
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
