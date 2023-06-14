import { parentPort } from 'worker_threads';
import { listen } from './network/listen';
import { PORT } from './util/const';

listen().then(() => {
  if (parentPort) {
      parentPort.postMessage(`Server started on port ${PORT}`);
  }
});
