import ExcelJS from "exceljs"
import { type PicketProps } from "@/app/props/db"
import { dateFormatter, formatConfig } from "@/app/lib/global-utils"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type * as AutoTable from "jspdf-autotable"
import { dateTZ } from "@/app/lib/date-timezone"
import picketTemplate from "@/app/data/template/picket.json"

export const handleSavePicketToExcel = async (
    data: PicketProps | null,
    fileName: string,
    sheetName?: string
) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(sheetName)
    worksheet.columns = picketTemplate.excelheader.map((item) => ({
        header: item.header,
        key: item.key,
        width: item.width,
        style: { alignment: { vertical: "middle", horizontal: "center" } },
    }))
    data?.pickets.forEach((picket) => {
        const employees = picket.employees
        const weekday = dateFormatter.longWeekdayFormat.format(picket.schedule)
        const date = dateFormatter.longFullFormat.format(picket.schedule)

        worksheet.addRow({
            schedule: `${weekday} / ${date}`,
            supervisor: picket.supervisor,
            name1: employees.first.name,
            name2: employees.second.name,
        })
    })
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true }
    headerRow.alignment = { vertical: "middle", horizontal: "center" }
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = fileName
    anchor.click()
    window.URL.revokeObjectURL(url)
}

export const handleSavePicketToPdf = (
    data: PicketProps | null,
    title: string,
    fileName: string
) => {
    const generatedDate = dateTZ.parseTZ(data?.generatedAt)
    const documentConfig = {
        month: generatedDate.format("MM"),
        year: generatedDate.format("YYYY"),
        date: dateFormatter.longFullFormat.format(generatedDate.toDate()),
    }
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    })
    const pageWidth = doc.internal.pageSize.getWidth()

    const headerText = formatConfig(picketTemplate.header.join(""), documentConfig)
    const footerText = formatConfig(picketTemplate.footer.join(""), documentConfig)
    const signText = formatConfig(picketTemplate.sign.join(""), documentConfig)
    const tableHeaders = picketTemplate.tabheader

    const tableBody: AutoTable.RowInput[] = []
    data?.pickets.forEach((picket) => {
        const weekday = dateFormatter.longWeekdayFormat.format(picket.schedule)
        const date = dateFormatter.longFullFormat.format(picket.schedule)
        const bodyConfig = {
            week: weekday,
            date,
            supervisor: picket.supervisor,
            name1: picket.employees.first.name,
            name2: picket.employees.second.name,
        }
        tableBody.push(
            picketTemplate.tabbody.map((item) => ({
                content: formatConfig(item.content, bodyConfig),
                styles: {
                    valign: item.styles.valign as AutoTable.VAlignType,
                    halign: item.styles.halign as AutoTable.HAlignType,
                    font: item.styles.font,
                },
            }))
        )
    })
    const columnStyles: Partial<AutoTable.Styles>[] = [
        { cellWidth: 36 },
        { cellWidth: 32 },
        { cellWidth: 50 },
        { cellWidth: 50 },
    ]
    const autoTableOptions: AutoTable.UserOptions = {
        head: tableHeaders,
        body: tableBody,
        theme: "grid",
        headStyles: {
            fillColor: false,
            textColor: [0, 0, 0],
            fontStyle: "bold",
            valign: "middle",
            halign: "center",
            font: "times",
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
        },
        didParseCell: (hookData) => {
            if (hookData.section === "head" && hookData.row.index === 1) {
                hookData.cell.styles.cellPadding = 0
            }
        },
        styles: {
            cellPadding: 3,
            valign: "middle",
            halign: "center",
            font: "times",
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
        },
        columnStyles: Object.fromEntries(columnStyles.entries()),
    }
    const totalTableWidth = columnStyles.reduce((acc, col) => {
        const width = typeof col.cellWidth === "number" ? col.cellWidth : 0
        return acc + width
    }, 0)
    const margin = (pageWidth - totalTableWidth) / 2
    autoTableOptions.margin = { left: margin, right: margin }
    autoTableOptions.startY = margin + 23

    doc.setFontSize(10)
    doc.setFont("times")
    doc.text(headerText, pageWidth / 2 - margin, margin)
    doc.text(title, pageWidth / 2, margin + 15, { align: "center" })
    autoTable(doc, autoTableOptions)

    const finalY = (doc as jsPDF & { lastAutoTable: AutoTable.Table }).lastAutoTable.finalY
    const startYAfterTable = finalY || 0
    doc.setFontSize(10)
    doc.setFont("times")
    doc.text(footerText, margin, startYAfterTable + 10)
    doc.text(signText, pageWidth / 2 + margin + 10, startYAfterTable + 40, { align: "center" })
    doc.save(fileName)
}
