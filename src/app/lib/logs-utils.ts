import fs from "fs/promises"
import path from "path"
import { dateTZ } from "@/app/lib/date-timezone"
import { LogLevel } from "@/app/props/logs"
import { LOGS_DIR } from "@/app/vars/db-vars"

export const writeLog = async (message: unknown, level: LogLevel = "INFO") => {
    let strMessage = String(message)

    if (message instanceof Error) strMessage = message.message
    if (typeof message === "string") strMessage = message
    if (message && typeof message === "object" && "message" in message) {
        strMessage = String((message as { message: unknown }).message)
    }
    try {
        await fs.mkdir(LOGS_DIR, { recursive: true })

        const now = dateTZ.now()
        const dateStr = now.format("YYYY-MM-DD")
        const timeStr = now.format("YYYY-MM-DD HH:mm:ss")
        const filePath = path.join(path.resolve(process.cwd(), LOGS_DIR), `${dateStr}.log`)
        const logEntry = `[${timeStr}] [${level}] ${strMessage}\n`

        await fs.appendFile(filePath, logEntry, "utf-8")
    } catch (err) {
        console.error(err)
    }
}
