import path from "path"
import * as z from "zod"

export const LogType = z.enum(["INFO", "WARN", "ERROR", "DEBUG"])
export type LogLevel = z.infer<typeof LogType>
export const LOGS_DIR = path.join(process.cwd(), "logs")
