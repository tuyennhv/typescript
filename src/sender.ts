import { send } from "./network/send";

send().then(() => {
  console.log("Done sending");
})