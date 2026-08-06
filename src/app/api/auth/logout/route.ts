"use server"

import { NextResponse } from "next/server"

export async function POST() {
    try {
        const response = NextResponse.json({
            success: true,
            message: "Berhasil keluar dari sistem.",
        })

        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 0,
            path: "/",
        })

        return response
    } catch (err) {
        console.error(err)

        return NextResponse.json(
            {
                success: false,
                message: "Terjadi kesalahan internal server.",
            },
            {
                status: 500,
            }
        )
    }
}
