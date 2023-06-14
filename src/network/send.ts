import { Socket } from 'net';
import { BYE_MESSAGE, DEFAULT_DURATION_MS, HI_MESSAGE, HOST, PORT } from '../util/const';
import { sleep } from '../util/util';

export async function send(durationMs = DEFAULT_DURATION_MS): Promise<void> {
  const client = new Socket();
  client.connect(PORT, HOST, () => {
    console.log("Connected to server");
    client.write(HI_MESSAGE);
  });

  await sleep(1000);
  const start = Date.now();

  while (Date.now() - start < durationMs) {
    client.write(String(Date.now()));
    await sleep(10);
  }

  await sleep(1000);
  client.write(BYE_MESSAGE);
  client.end();
}
