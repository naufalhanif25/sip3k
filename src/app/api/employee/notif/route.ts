import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyJWT } from "@/app/lib/global-utils"
import { writeLog } from "@/app/lib/logs-utils"
import { sendDirectWAMessage } from "@/app/lib/picket-db-handler"
import { dateTZ } from "@/app/lib/date-timezone"
import {
    INVALID_BODY_RESPONSE,
    SERVER_ERROR_RESPONSE,
    UNAUTHORIZED_RESPONSE,
} from "@/app/vars/db-vars"

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        const isValidToken = token ? await verifyJWT(token) : null

        if (!isValidToken) {
            return UNAUTHORIZED_RESPONSE
        }
        const body = await req.json()

        if (!body || !body.data || !body.date) {
            return INVALID_BODY_RESPONSE
        }
        const employee = body.data
        const name = employee.name as string
        const phone = employee.phone as string
        const data = await sendDirectWAMessage(name, phone, dateTZ.getTZDate(body.date))

        if (data.status) {
            return NextResponse.json({
                success: true,
                message: `Berhasil mengirim pemberitahuan kepada ${name}.`,
            })
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: `Gagal mengirim pemberitahuan kepada ${name}.`,
                },
                { status: 400 }
            )
        }
    } catch (err) {
        console.error(err)
        await writeLog(err, "ERROR")
        return SERVER_ERROR_RESPONSE
    }
}
