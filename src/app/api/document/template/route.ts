import { NextResponse } from "next/server"
import { DATABASE_PATH, TEMPLATE_PATH } from "@/app/vars/global-vars"
import { type ExcelCellProps, ExcelCell } from "@/app/props/api"
import { JSONFilePreset } from "lowdb/node"
import { DataBase, DEFAULT_DATA } from "@/app/props/db"
import ExcelJS from "exceljs"
import { getDocumentCode } from "@/app/lib/sptjb-utils-handler"
import { cookies } from "next/headers"
import { verifyJWT } from "@/app/lib/global-utils"
import { writeLog } from "@/app/lib/logs-utils"
import { SERVER_ERROR_RESPONSE, UNAUTHORIZED_RESPONSE } from "@/app/vars/db-vars"
import path from "path"

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value
        const isValidToken = token ? await verifyJWT(token) : null

        if (!isValidToken) {
            return UNAUTHORIZED_RESPONSE
        }
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(TEMPLATE_PATH)
        const worksheet = workbook.worksheets[0]
        if (!worksheet) throw new Error("Worksheet tidak ditemukan.")

        const merges = worksheet.model.merges || []
        let documentCode: string = ""
        const columns =
            worksheet.columns?.map((col) => ({
                width: col.width || 10,
            })) || []
        const rowsData: ExcelCellProps[][] = []

        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            const rowCells: ExcelCellProps[] = []

            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                const parsedValue = getDocumentCode(String(cell.result ?? cell.value ?? ""))
                if (parsedValue.isTrue) documentCode = parsedValue.value
                const finalValue = `${parsedValue.prefix || ""}${parsedValue.value}`

                rowCells[colNumber - 1] = ExcelCell.parse({
                    value: finalValue,
                    type: cell.type || ExcelJS.ValueType.String,
                    alignment: {
                        horizontal: cell.alignment?.horizontal,
                        vertical: cell.alignment?.vertical,
                        wrapText: Boolean(cell.alignment?.wrapText),
                    },
                    font: cell.font || {},
                    fill: cell.fill || {},
                    border: cell.border || {},
                })
            })
            rowsData[rowNumber - 1] = rowCells
        })
        const headerFooter = worksheet.headerFooter || {}
        const lastRow = rowsData[rowsData.length - 1]
        const lastCell = lastRow[lastRow.length - 1]
        const db = await JSONFilePreset(path.resolve(process.cwd(), DATABASE_PATH), DEFAULT_DATA)
        const data = DataBase.parse(db.data)

        return NextResponse.json({
            success: true,
            data: {
                code: documentCode,
                length: data.sptjb.length,
                merges,
                rows: rowsData,
                columns,
                headerFooter: {
                    font: {
                        name: lastCell.font.name,
                        size: lastCell.font.size,
                        family: lastCell.font.family,
                    },
                    differentFirst: headerFooter.differentFirst || false,
                    differentOddEven: headerFooter.differentOddEven || false,
                    oddHeader: headerFooter.oddHeader || "",
                    oddFooter: headerFooter.oddFooter || "",
                    evenHeader: headerFooter.evenHeader || "",
                    evenFooter: headerFooter.evenFooter || "",
                    firstHeader: headerFooter.firstHeader || "",
                    firstFooter: headerFooter.firstFooter || "",
                },
            },
        })
    } catch (err) {
        console.error(err)
        await writeLog(err, "ERROR")
        return SERVER_ERROR_RESPONSE
    }
}
