import path from "path"
import * as z from "zod"

export const ENUM_TYPE = ["INFO", "WARN", "ERROR", "DEBUG"]

export const LogType = z.enum(ENUM_TYPE).default(ENUM_TYPE[0])
export type LogLevel = z.infer<typeof LogType>
export const LOGS_DIR = path.join(process.cwd(), "logs")
