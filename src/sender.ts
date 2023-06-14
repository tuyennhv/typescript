import { send } from "./network/send";

send(5*1000).then(() => {
  console.log("Done sending");
})