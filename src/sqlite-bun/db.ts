import Database from "bun:sqlite"
import { volume } from "../utilities/volume"

export const db = new Database(`${volume}/db-bun.sqlite`)
