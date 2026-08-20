import { Cron } from "croner"
import { JSONFilePreset } from "lowdb/node"
import { DataBase } from "@/app/props/db"
import { generatePicketSchedule, sendDirectWAMessage } from "@/app/lib/picket-db-handler"
import { writeLog } from "@/app/lib/logs-utils"
import { matchDate } from "@/app/lib/global-utils"
import { dateTZ } from "@/app/lib/date-timezone"
import { DEFAULT_DATA, DATABASE_PATH } from "@/app/vars/db-vars"
import { TIMEZONE } from "@/app/vars/db-vars"
import path from "path"

new Cron("0 8 * * *", { timezone: TIMEZONE }, async () => {
    const today = dateTZ.now()

    if (today.date() === today.daysInMonth()) {
        try {
            const db = await JSONFilePreset(
                path.resolve(process.cwd(), DATABASE_PATH),
                DataBase.parse(DEFAULT_DATA)
            )
            const data = DataBase.parse(db.data)
            const { existingBatchIndex, newPicket } = generatePicketSchedule(data)

            if (existingBatchIndex === -1 && newPicket) {
                db.data.pickets.push(newPicket)
                await db.write()

                const message = "Berhasil men-generate jadwal piket baru."
                console.log(message)
                await writeLog(message, "INFO")
            }
        } catch (err) {
            console.error(err)
            await writeLog(err, "ERROR")
        }
    }
})

new Cron("0 10 * * *", { timezone: TIMEZONE }, async () => {
    const tomorrow = dateTZ.now().add(1, "day").toDate()

    try {
        const db = await JSONFilePreset(
            path.resolve(process.cwd(), DATABASE_PATH),
            DataBase.parse(DEFAULT_DATA)
        )
        const data = DataBase.parse(db.data)
        if (!data.pickets || data.pickets.length === 0) return
        const targetPicket = data.pickets.find((value) =>
            matchDate.isInRange(value.startAt, value.endAt, tomorrow)
        )
        if (!targetPicket) return
        const tomorrowPicket = targetPicket.pickets.find((value) =>
            matchDate.isEquals(value.schedule, tomorrow)
        )
        if (!tomorrowPicket) return
        const firstEmployee = tomorrowPicket.employees.first
        const secondEmployee = tomorrowPicket.employees.second

        await sendDirectWAMessage(firstEmployee.name, firstEmployee.phone, tomorrow)
        await sendDirectWAMessage(secondEmployee.name, secondEmployee.phone, tomorrow)
        await writeLog(
            `Berhasil mengirim pesan pengingat piket kepada ${firstEmployee.name} dan ${
                secondEmployee.name
            }`,
            "INFO"
        )
    } catch (err) {
        console.error(err)
        await writeLog(err, "ERROR")
    }
})

const message = "Layanan Cron Piket berhasil diaktifkan."
console.log(message)
await writeLog(message, "INFO")
