import { digest } from "@chainsafe/as-sha256";
import crypto from "crypto";

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function heavyOperationLastingOneSecond(): void {
  const start = Date.now();
  while (Date.now() - start < 1000) {
    digest(crypto.randomBytes(32));
  }
  console.log("Done performing heavy operation in", Date.now() - start);
}
