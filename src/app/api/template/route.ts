import { NextResponse } from "next/server"
import path from "path"
import { ExcelCellProps, ExcelCell } from "@/app/props/api"
import ExcelJS from "exceljs"

export async function GET() {
    const filePath = path.join(process.cwd(), "public", "template.xlsx")

    try {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(filePath)
        const worksheet = workbook.worksheets[0]

        if (!worksheet) {
            throw new Error("Worksheet tidak ditemukan.")
        }
        const merges = worksheet.model.merges || []
        const columns =
            worksheet.columns?.map((col) => ({
                width: col.width || 10,
            })) || []
        const rowsData: ExcelCellProps[][] = []

        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            const rowCells: ExcelCellProps[] = []

            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                rowCells[colNumber - 1] = ExcelCell.parse({
                    value: cell.result ?? cell.value ?? "",
                    type: cell.type || ExcelJS.ValueType.String,
                    alignment: cell.alignment || {},
                    font: cell.font || {},
                    fill: cell.fill || {},
                    border: cell.border || {},
                })
            })
            rowsData[rowNumber - 1] = rowCells
        })

        return NextResponse.json({
            success: true,
            data: {
                merges,
                rows: rowsData,
                columns,
            },
        })
    } catch (e) {
        console.log(e)
        return NextResponse.json(
            {
                success: false,
                message: "Gagal membaca file template. File tidak tersedia atau rusak.",
            },
            {
                status: 500,
            }
        )
    }
}
