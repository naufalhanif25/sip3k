import { NextResponse } from "next/server"
import { JSONFilePreset } from "lowdb/node"
import { DEFAULT_DATA, DataBase } from "@/app/props/db"
import { matchDate } from "@/app/lib/global-utils"
import { writeLog } from "@/app/lib/logs-utils"
import { cookies } from "next/headers"
import { verifyJWT } from "@/app/lib/global-utils"
import { dateTZ } from "@/app/lib/date-timezone"
import { SERVER_ERROR_RESPONSE, UNAUTHORIZED_RESPONSE } from "@/app/vars/db-vars"

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        const isValidToken = token ? await verifyJWT(token) : null

        if (!isValidToken) {
            return UNAUTHORIZED_RESPONSE
        }
        const db = await JSONFilePreset("data/db.json", DEFAULT_DATA)
        const data = DataBase.parse(db.data)
        const now = dateTZ.nowDate()
        const targetPicket = data.pickets.find((value) =>
            matchDate.isInRange(value.startAt, value.endAt, now)
        )
        const notFoundResponse = NextResponse.json({
            success: true,
            message: "Jadwal piket hari ini tidak ditemukan.",
            data: null,
        })
        if (!targetPicket) {
            return notFoundResponse
        }
        const todayPicket = targetPicket.pickets.find((value) =>
            matchDate.isEquals(value.schedule, now)
        )
        if (!todayPicket) {
            return notFoundResponse
        }
        return NextResponse.json({
            success: true,
            message: "Jadwal piket hari ini berhasil diambil.",
            data: todayPicket,
        })
    } catch (err) {
        console.error(err)
        await writeLog(err, "ERROR")
        return SERVER_ERROR_RESPONSE
    }
}
