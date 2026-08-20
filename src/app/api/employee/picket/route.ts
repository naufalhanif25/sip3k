import { DataBase, DEFAULT_DATA } from "@/app/props/db"
import { DATABASE_PATH } from "@/app/vars/global-vars"
import { JSONFilePreset } from "lowdb/node"
import { NextRequest, NextResponse } from "next/server"
import { generatePicketSchedule } from "@/app/lib/picket-db-handler"
import { cookies } from "next/headers"
import { verifyJWT } from "@/app/lib/global-utils"
import { writeLog } from "@/app/lib/logs-utils"
import { dateTZ } from "@/app/lib/date-timezone"
import {
    INVALID_BODY_RESPONSE,
    SERVER_ERROR_RESPONSE,
    UNAUTHORIZED_RESPONSE,
} from "@/app/vars/db-vars"
import path from "path"

export async function POST() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        const isValidToken = token ? await verifyJWT(token) : null

        if (!isValidToken) {
            return UNAUTHORIZED_RESPONSE
        }
        const db = await JSONFilePreset(path.resolve(process.cwd(), DATABASE_PATH), DEFAULT_DATA)
        const data = DataBase.parse(db.data)
        const { existingBatchIndex, newPicket } = generatePicketSchedule(data, true)
        const newPicketBatch = newPicket!

        if (existingBatchIndex !== -1) db.data.pickets[existingBatchIndex] = newPicketBatch
        else db.data.pickets.push(newPicketBatch)
        await db.write()
        return NextResponse.json({
            success: true,
            message: `Berhasil men-generate ${newPicketBatch.pickets.length} jadwal piket untuk periode ${
                newPicketBatch.startAt.toISOString().split("T")[0]
            } s/d ${newPicketBatch.endAt.toISOString().split("T")[0]}.`,
        })
    } catch (err) {
        console.error(err)
        await writeLog(err, "ERROR")
        return SERVER_ERROR_RESPONSE
    }
}

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        const isValidToken = token ? await verifyJWT(token) : null

        if (!isValidToken) {
            return UNAUTHORIZED_RESPONSE
        }
        const db = await JSONFilePreset(path.resolve(process.cwd(), DATABASE_PATH), DEFAULT_DATA)
        const data = DataBase.parse(db.data)

        if (!data.pickets || data.pickets.length === 0) {
            return NextResponse.json({
                success: true,
                data: null,
                message: "Belum ada data piket yang tercatat.",
            })
        }
        const sortedPicketBatches = [...data.pickets].sort(
            (a, b) => dateTZ.parseTZ(a.startAt).valueOf() - dateTZ.parseTZ(b.startAt).valueOf()
        )
        const today = dateTZ.now()
        let currentPicketBatch = sortedPicketBatches.find((batch) => {
            const start = dateTZ.parseTZ(batch.startAt).startOf("day")
            const end = dateTZ.parseTZ(batch.endAt).endOf("day")

            return !today.isBefore(start) && !today.isAfter(end)
        })
        if (!currentPicketBatch) {
            currentPicketBatch = sortedPicketBatches[sortedPicketBatches.length - 1]
        }
        return NextResponse.json({
            success: true,
            message: "Data jadwal piket terkini berhasil diambil.",
            data: currentPicketBatch,
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
        const body = await req.json()

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "ID piket tidak ditemuakan.",
                },
                { status: 400 }
            )
        }
        if (!body || !body.id || !body.employees) {
            return INVALID_BODY_RESPONSE
        }
        const db = await JSONFilePreset(path.resolve(process.cwd(), DATABASE_PATH), DEFAULT_DATA)
        const data = DataBase.parse(db.data)
        const validEmployeeIds = new Set(data.employees.map((emp) => emp.employeeId))
        if (
            !validEmployeeIds.has(body.employees.first.employeeId) ||
            !validEmployeeIds.has(body.employees.second.employeeId)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Data pegawai tidak ditemukan.`,
                },
                { status: 404 }
            )
        }
        const groupIndex = data.pickets.findIndex((value) => value.id === id)
        if (groupIndex === -1) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Kelompok piket tidak ditemukan.",
                },
                { status: 404 }
            )
        }
        const scheduleIndex = data.pickets[groupIndex].pickets.findIndex(
            (value) => value.id === body.id
        )
        if (scheduleIndex === -1) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Jadwal piket tidak ditemukan.",
                },
                { status: 404 }
            )
        }
        db.data.pickets[groupIndex].pickets[scheduleIndex].employees = body.employees
        await db.write()
        return NextResponse.json({
            success: true,
            message: "Data jadwal piket berhasil diperbarui.",
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
        const picketId = searchParams.get("picketId")

        if (!id || !picketId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "ID piket tidak ditemuakan.",
                },
                { status: 400 }
            )
        }
        const db = await JSONFilePreset(path.resolve(process.cwd(), DATABASE_PATH), DEFAULT_DATA)
        const data = DataBase.parse(db.data)
        const groupIndex = data.pickets.findIndex((item) => item.id === id)
        if (groupIndex === -1) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Kelompok piket tidak ditemukan.",
                },
                { status: 404 }
            )
        }
        const targetGroup = db.data.pickets[groupIndex]
        const initialCount = targetGroup.pickets.length
        targetGroup.pickets = targetGroup.pickets.filter((picket) => picket.id !== picketId)
        if (targetGroup.pickets.length === initialCount) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Jadwal piket tidak ditemukan.",
                },
                { status: 404 }
            )
        }
        await db.write()
        return NextResponse.json(
            {
                success: true,
                message: "Jadwal piket berhasil dihapus.",
            },
            { status: 200 }
        )
    } catch (err) {
        console.error(err)
        await writeLog(err, "ERROR")
        return SERVER_ERROR_RESPONSE
    }
}
