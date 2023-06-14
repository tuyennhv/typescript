import { Socket } from 'net';
import { BYE_MESSAGE, DEFAULT_DURATION_MS, HI_MESSAGE, HOST, PORT } from '../util/const';
import { sleep } from '../util/util';
import { promisify } from 'util';

const numClients = 1;

export async function send(hiMessage: string, durationMs = DEFAULT_DURATION_MS): Promise<void> {
  const clients: Socket[] = [];
  const promises: Promise<void>[] = [];
  for (let i = 0; i < numClients; i++) {
    const client = new Socket();
    clients.push(client);
    promises.push((promisify<number, string>(client.connect.bind(client)))(PORT, HOST));
  }
  // await (promisify<number, string>(client.connect.bind(client)))(PORT, HOST);
  await Promise.all(promises);
  clients[numClients - 1].write(hiMessage);

  await sleep(1000);
  const start = Date.now();
  let count = 0;
  while (Date.now() - start < durationMs) {
    const now = String(Date.now());
    for (const client of clients) {
      client.write(now.slice());
      count++;
    }
    await sleep(1);
  }

  console.log(`Sent ${count} messages in ${durationMs}ms`);
  await sleep(1000);
  clients[numClients - 1].write(BYE_MESSAGE);
  for (const client of clients) {
    client.end();
  }
}
