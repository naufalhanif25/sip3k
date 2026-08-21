import fs from "fs/promises"
import path from "path"
import { writeLog } from "@/app/lib/logs-utils"
import { BACKUP_PATH, DATABASE_PATH } from "@/app/vars/global-vars"

async function restoreLatestUpdate() {
    try {
        const databasePath = path.resolve(process.cwd(), DATABASE_PATH)
        const backupPath = path.resolve(process.cwd(), BACKUP_PATH)
        try {
            await fs.access(backupPath)
        } catch {
            console.error(`Folder backup tidak ditemukan di: ${backupPath}`)
            return
        }
        const files = await fs.readdir(backupPath)
        const backupFiles = files
            .filter((file) => file.startsWith("db-backup-") && file.endsWith(".json"))
            .sort()

        if (backupFiles.length === 0) {
            console.error("Tidak ditemukan berkas backup .json untuk di-restore.")
            return
        }
        const latestBackupFile = backupFiles[backupFiles.length - 1]
        const latestBackupPath = path.join(backupPath, latestBackupFile)
        await fs.copyFile(latestBackupPath, databasePath)
        
        const message = `Database berhasil di-restore menggunakan backup terbaru: ${latestBackupFile}`
        console.log(message)
        await writeLog(message, "INFO")
    } catch (err) {
        console.error(err)
        await writeLog(err, "ERROR")
    }
}

await restoreLatestUpdate()