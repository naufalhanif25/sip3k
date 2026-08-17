import { NextResponse } from "next/server"

export const INVALID_BODY_RESPONSE = NextResponse.json(
    {
        success: false,
        message: "Data body tidak lengkap. Seluruh data wajib terisi dengan benar.",
    },
    { status: 400 }
)

export const UNAUTHORIZED_RESPONSE = NextResponse.json(
    {
        success: false,
        message: "Anda tidak memiliki izin akses.",
    },
    { status: 401 }
)

export const SERVER_ERROR_RESPONSE = NextResponse.json(
    {
        success: false,
        message: "Terjadi kesalahan internal server.",
    },
    { status: 500 }
)
