import { randomUUID } from "node:crypto"

export const ids: Array<string> = new Array(2048).fill(0).map(() => randomUUID())
