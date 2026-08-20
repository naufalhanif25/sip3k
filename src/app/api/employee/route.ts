import { NextRequest, NextResponse } from "next/server"
import { JSONFilePreset } from "lowdb/node"
import { DataBase, Employee } from "@/app/props/db"
import { DATABASE_PATH, DEFAULT_DATA } from "@/app/vars/db-vars"
import { EmployeeClass, EmployeeGender } from "@/app/props/picket"
import romans from "romans"
import { cookies } from "next/headers"
import { valueValidator, verifyJWT } from "@/app/lib/global-utils"
import { writeLog } from "@/app/lib/logs-utils"
import {
    INVALID_BODY_RESPONSE,
    SERVER_ERROR_RESPONSE,
    UNAUTHORIZED_RESPONSE,
} from "@/app/vars/db-vars"
import path from "path"

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        const isValidToken = token ? await verifyJWT(token) : null

        if (!isValidToken) {
            return UNAUTHORIZED_RESPONSE
        }
        const db = await JSONFilePreset(
            path.resolve(process.cwd(), DATABASE_PATH),
            DataBase.parse(DEFAULT_DATA)
        )
        const data = DataBase.parse(db.data)
        const sortedEmployees = [...data.employees].sort((a, b) => a.name.localeCompare(b.name))

        return NextResponse.json({
            success: true,
            message: "Data pegawai berhasil diambil.",
            data: sortedEmployees,
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
                    message: "Parameter ID pegawai wajib disertakan.",
                },
                { status: 400 }
            )
        }
        const db = await JSONFilePreset(
            path.resolve(process.cwd(), DATABASE_PATH),
            DataBase.parse(DEFAULT_DATA)
        )
        const data = DataBase.parse(db.data)
        const index = data.employees.findIndex((item) => item.employeeId === id)

        if (index === -1) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Pegawai tidak ditemukan.",
                },
                { status: 404 }
            )
        }
        data.employees.splice(index, 1)
        db.data = data
        await db.write()
        return NextResponse.json({
            success: true,
            message: "Pegawai berhasil dihapus.",
        })
    } catch (err) {
        console.error(err)
        await writeLog(err, "ERROR")
        return SERVER_ERROR_RESPONSE
    }
}

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        const isValidToken = token ? await verifyJWT(token) : null

        if (!isValidToken) {
            return UNAUTHORIZED_RESPONSE
        }
        const body = await req.json()

        if (
            !body ||
            !body.employeeId ||
            !body.name ||
            !body.position ||
            !body.phone ||
            !body.gender ||
            !body.rank ||
            !body.category
        ) {
            return INVALID_BODY_RESPONSE
        }
        if (
            !valueValidator.isValidText(body.name) ||
            !valueValidator.isValidPhone(body.phone) ||
            !valueValidator.isValidID(body.employeeId)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Data pegawai tidak valid.",
                },
                { status: 400 }
            )
        }
        const db = await JSONFilePreset(
            path.resolve(process.cwd(), DATABASE_PATH),
            DataBase.parse(DEFAULT_DATA)
        )
        const data = DataBase.parse(db.data)
        const isExist = data.employees.some((employee) => employee.employeeId === body.employeeId)
        const categoryParts = body.category.split("/")
        const _class = categoryParts[0]
        const room = categoryParts[1]

        if (isExist) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Pegawai sudah terdaftar.",
                },
                { status: 400 }
            )
        }
        const newEmployee = Employee.parse({
            employeeId: body.employeeId,
            name: body.name,
            position: body.position,
            phone: body.phone,
            gender: body.gender,
            genderId: (body.gender as EmployeeGender) === "L" ? 0 : 1,
            rank: body.rank,
            class: _class,
            classId: romans.deromanize(_class as EmployeeClass),
            room: room,
            roomId: (room as EmployeeClass).charCodeAt(0) - 97,
        })
        db.data.employees.push(newEmployee)
        await db.write()
        return NextResponse.json({
            success: true,
            message: "Data pegawai berhasil ditambahkan.",
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
        const body = await req.json()

        if (
            !body ||
            !body.employeeId ||
            !body.position ||
            !body.phone ||
            !body.rank ||
            !body.category
        ) {
            return INVALID_BODY_RESPONSE
        }
        if (!valueValidator.isValidID(body.employeeId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Data pegawai tidak valid.",
                },
                { status: 400 }
            )
        }
        const db = await JSONFilePreset(
            path.resolve(process.cwd(), DATABASE_PATH),
            DataBase.parse(DEFAULT_DATA)
        )
        const data = DataBase.parse(db.data)
        const index = data.employees.findIndex((item) => item.employeeId === body.employeeId)

        if (index === -1) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Pegawai tidak ditemukan.",
                },
                { status: 404 }
            )
        }
        const categoryParts = body.category.split("/")
        const _class = categoryParts[0]
        const room = categoryParts[1]
        const updatedEmployee = Employee.parse({
            ...data.employees[index],
            position: body.position,
            phone: body.phone,
            rank: body.rank,
            class: _class,
            classId: romans.deromanize(_class as EmployeeClass),
            room: room,
            roomId: (room as EmployeeClass).charCodeAt(0) - 97,
        })
        data.employees[index] = updatedEmployee
        db.data = data
        await db.write()
        return NextResponse.json({
            success: true,
            message: "Data karyawan berhasil diperbarui.",
        })
    } catch (err) {
        console.error(err)
        await writeLog(err, "ERROR")
        return SERVER_ERROR_RESPONSE
    }
}
