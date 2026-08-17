import { NextRequest, NextResponse } from "next/server"
import * as bcrypt from "bcrypt-ts"
import * as jwt from "jsonwebtoken"
import { INVALID_BODY_RESPONSE, SERVER_ERROR_RESPONSE } from "@/app/vars/db-vars"
import { writeLog } from "@/app/lib/logs-utils"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        if (!body || !body.username || !body.password) {
            return INVALID_BODY_RESPONSE
        }
        const validUsername = process.env.ADMIN_USERNAME!
        const hashedPassword = process.env.ADMIN_PASSWORD!
        const username = body.username
        const password = body.password
        const isPasswordValid = bcrypt.compareSync(password, hashedPassword)

        if (username !== validUsername || !isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Nama pengguna atau kata sandi salah.",
                },
                { status: 401 }
            )
        }
        const jwtToken = process.env.JWT_SECRET!
        const isRemember = Boolean(body.isRemember)
        const maxAgeInSeconds = isRemember ? 7 * 24 * 60 * 60 : 5 * 60 * 60
        const token = jwt.sign({ username }, jwtToken, { expiresIn: maxAgeInSeconds })
        const response = NextResponse.json({
            success: true,
            message: `Berhasil masuk sebagai ${username}.`,
            data: {
                username,
            },
        })
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: maxAgeInSeconds,
            path: "/",
        })
        return response
    } catch (err) {
        console.error(err)
        await writeLog(err, "ERROR")
        return SERVER_ERROR_RESPONSE
    }
}
