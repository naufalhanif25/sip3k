import * as z from "zod"
import { LOG_TYPES } from "@/app/vars/db-vars"

export const LogType = z.enum(LOG_TYPES)
export type LogLevel = z.infer<typeof LogType>
