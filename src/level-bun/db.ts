import levelup from "levelup"
import leveldown from "leveldown"
import { volume } from "../utilities/volume"

export const db = levelup(leveldown(`${volume}/level-bun.db`))
