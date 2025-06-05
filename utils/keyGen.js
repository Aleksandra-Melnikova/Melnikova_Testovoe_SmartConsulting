import { randomUUID } from "node:crypto";

export function keyGen() {
  return randomUUID();
}
