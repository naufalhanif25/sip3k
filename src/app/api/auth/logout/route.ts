import { writeLog } from "@/app/lib/logs-utils"
import { SERVER_ERROR_RESPONSE } from "@/app/vars/db-vars"
import { NextResponse } from "next/server"

export async function POST() {
    try {
        const response = NextResponse.json({
            success: true,
            message: "Berhasil keluar dari sistem.",
        })
        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",
            sameSite: "lax",
            maxAge: 0,
            path: "/",
        })
        return response
    } catch (err) {
        console.error(err)
        await writeLog(err, "ERROR")
        return SERVER_ERROR_RESPONSE
    }
}
