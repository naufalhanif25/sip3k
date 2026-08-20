import { NextResponse } from "next/server"
import employees from "@/../data/employees.json"
import variables from "@/app/data/variables.json"

export const DEFAULT_DATA = {
    employees: employees.map((employee) => ({
        employeeId: employee.employeeid,
        name: employee.name,
        position: employee.position,
        phone: employee.phone,
        gender: employee.gender,
        genderId: employee.genderid,
        rank: employee.rank,
        class: employee.class,
        classId: employee.classid,
        room: employee.room,
        roomId: employee.roomid,
    })),
    pickets: [],
    sptjb: [],
}

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

export const LOCALE = "id-ID"
export const TIMEZONE = "Asia/Jakarta"
export const MAX_BACKUP_FILES = 30
export const LOGS_DIR = variables.filepaths.logs
export const LOG_TYPES = ["INFO", "WARN", "ERROR", "DEBUG"]
export const DATABASE_PATH = variables.filepaths.db
export const TEMPLATE_PATH = variables.filepaths.template
export const NOTIF_TEMPLATE_PATH = variables.filepaths.notif
export const BACKUP_PATH = variables.filepaths.backups