import { NextResponse, NextRequest } from "next/server"
import { JSONFilePreset } from "lowdb/node"
import { DEFAULT_DATA, SPTJBDetail } from "@/app/props/db"
import { DATABASE_PATH } from "@/app/vars/global-vars"
import { DataBase } from "@/app/props/db"
import { Division, FormInputProps } from "@/app/props/sptjb"
import { verifyJWT } from "@/app/lib/global-utils"
import { writeLog } from "@/app/lib/logs-utils"
import { cookies } from "next/headers"
import { dateTZ } from "@/app/lib/date-timezone"
import {
    INVALID_BODY_RESPONSE,
    SERVER_ERROR_RESPONSE,
    UNAUTHORIZED_RESPONSE,
} from "@/app/vars/db-vars"
import { v4 as uuidv4 } from "uuid"
import path from "path"

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        const isValidToken = token ? await verifyJWT(token) : null

        if (!isValidToken) {
            return UNAUTHORIZED_RESPONSE
        }
        const body = await req.json()

        if (!body || !body.name || !body.docId || !body.division || !body.data || !body._class) {
            return INVALID_BODY_RESPONSE
        }
        const name = body.name as string
        const division = body.division as Division
        const _class = body._class as string
        const docId = body.docId as string
        const formData = body.data as FormInputProps[]
        const db = await JSONFilePreset(path.resolve(process.cwd(), DATABASE_PATH), DEFAULT_DATA)
        const data = DataBase.parse(db.data)
        const documentId = uuidv4()
        const newData = SPTJBDetail.parse({
            id: documentId,
            name,
            docId,
            division,
            _class,
            data: formData,
            createdAt: dateTZ.nowDate(),
            updatedAt: dateTZ.nowDate(),
        })
        data.sptjb.push(newData)
        db.data = data
        await db.write()
        return NextResponse.json({
            success: true,
            message: "Dokumen berhasil disimpan.",
            data: { id: documentId },
        })
    } catch (err) {
        console.error(err)
        await writeLog(err, "ERROR")
        return SERVER_ERROR_RESPONSE
    }
}

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        const isValidToken = token ? await verifyJWT(token) : null

        if (!isValidToken) {
            return UNAUTHORIZED_RESPONSE
        }
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        const db = await JSONFilePreset(path.resolve(process.cwd(), DATABASE_PATH), DEFAULT_DATA)
        const data = DataBase.parse(db.data)

        if (id) {
            const document = data.sptjb.find((item) => item.id === id)
            if (!document) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Dokumen tidak ditemukan.",
                    },
                    { status: 404 }
                )
            }
            return NextResponse.json({
                success: true,
                data: document,
            })
        }
        const sortedData = [...data.sptjb].sort((a, b) => {
            const numA = parseInt(a.docId?.match(/^B-(\d+)/)?.[1] || "0", 10)
            const numB = parseInt(b.docId?.match(/^B-(\d+)/)?.[1] || "0", 10)
            return numB - numA
        })
        return NextResponse.json({
            success: true,
            data: sortedData,
        })
    } catch (err) {
        console.error(err)
        await writeLog(err, "ERROR")
        return SERVER_ERROR_RESPONSE
    }
}

export async function PUT(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        const isValidToken = token ? await verifyJWT(token) : null

        if (!isValidToken) {
            return UNAUTHORIZED_RESPONSE
        }
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Parameter ID dokumen wajib disertakan.",
                },
                { status: 400 }
            )
        }
        const body = await req.json()

        if (!body || !body.name || !body.division || !body.data || !body._class) {
            return INVALID_BODY_RESPONSE
        }
        const name = body.name as string
        const division = body.division as Division
        const _class = body._class as string
        const formData = body.data as FormInputProps[]
        const db = await JSONFilePreset(path.resolve(process.cwd(), DATABASE_PATH), DEFAULT_DATA)
        const data = DataBase.parse(db.data)
        const index = data.sptjb.findIndex((item) => item.id === id)

        if (index === -1) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Dokumen tidak ditemukan.",
                },
                { status: 404 }
            )
        }
        const existingItem = data.sptjb[index]
        const updatedData = SPTJBDetail.parse({
            ...existingItem,
            name,
            division,
            data: formData,
            _class,
            updatedAt: dateTZ.nowDate(),
        })
        data.sptjb[index] = updatedData
        db.data = data
        await db.write()
        return NextResponse.json({
            success: true,
            message: "Dokumen berhasil diperbarui.",
            data: { id },
        })
    } catch (err) {
        console.error(err)
        await writeLog(err, "ERROR")
        return SERVER_ERROR_RESPONSE
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        const isValidToken = token ? await verifyJWT(token) : null

        if (!isValidToken) {
            return UNAUTHORIZED_RESPONSE
        }
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Parameter ID dokumen wajib disertakan.",
                },
                { status: 400 }
            )
        }
        const db = await JSONFilePreset(path.resolve(process.cwd(), DATABASE_PATH), DEFAULT_DATA)
        const data = DataBase.parse(db.data)
        const index = data.sptjb.findIndex((item) => item.id === id)

        if (index === -1) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Dokumen tidak ditemukan.",
                },
                { status: 404 }
            )
        }
        data.sptjb.splice(index, 1)
        db.data = data
        await db.write()
        return NextResponse.json({
            success: true,
            message: "Dokumen berhasil dihapus.",
        })
    } catch (err) {
        console.error(err)
        await writeLog(err, "ERROR")
        return SERVER_ERROR_RESPONSE
    }
}
