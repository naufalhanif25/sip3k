import { Cron } from "croner"
import fs from "fs/promises"
import path from "path"
import { writeLog } from "@/app/lib/logs-utils"
import { dateTZ } from "@/app/lib/date-timezone"
import { TIMEZONE } from "@/app/lib/date-timezone"
import { BACKUP_PATH, DATABASE_PATH, MAX_BACKUP_FILES } from "@/app/vars/global-vars"

new Cron("0 2 * * *", { timezone: TIMEZONE }, async () => {
    try {
        const databasePath = path.resolve(process.cwd(), DATABASE_PATH)
        const backupPath = path.resolve(process.cwd(), BACKUP_PATH)
        await fs.mkdir(backupPath, { recursive: true })

        const backupFiles = (await fs.readdir(backupPath))
            .filter((file) => file.startsWith("db-backup-") && file.endsWith(".json"))
            .sort()
        if (backupFiles.length > MAX_BACKUP_FILES) {
            const filesToDelete = backupFiles.slice(0, backupFiles.length - MAX_BACKUP_FILES)
            for (const file of filesToDelete) {
                await fs.unlink(path.join(backupPath, file))
            }
        }
        const timestamp = dateTZ.now().format("YYYY-MM-DD_HH-mm-ss")
        const fileName = `db-backup-${timestamp}.json`
        const destPath = path.resolve(backupPath, fileName)
        await fs.copyFile(databasePath, destPath)

        const message = `Database berhasil di-backup ke: ${destPath}`
        console.log(message)
        await writeLog(message, "INFO")
    } catch (err) {
        console.error(err)
        await writeLog(err, "ERROR")
    }
})

const message = "Layanan Cron Backup Database berhasil diaktifkan."
console.log(message)
await writeLog(message, "INFO")
