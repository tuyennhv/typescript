import { send } from "./network/send";
import { HI_MESSAGE, HI_MESSAGE_BUSY } from "./util/const";
import { sleep } from "./util/util";

async function main() {
  await send(HI_MESSAGE, 10 * 1000);
  await sleep(1000);
  await send (HI_MESSAGE_BUSY, 10 * 1000);
}

main().then(() => {
  console.log("Done sending");
})