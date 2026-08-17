import ExcelJS from "exceljs"
import { type PicketProps } from "@/app/props/db"
import { dateFormatter } from "@/app/lib/global-utils"
import jsPDF from "jspdf"
import autoTable, {
    RowInput as AutoTableRowInput,
    Styles as AutoTableStyles,
} from "jspdf-autotable"

const setAlignment = (vertical?: string, horizontal?: string) => {
    return {
        alignment: { vertical, horizontal } as ExcelJS.Alignment,
    } as ExcelJS.Style
}

export const handleSavePicketToExcel = async (
    data: PicketProps | null,
    fileName: string,
    sheetName?: string
) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(sheetName)
    worksheet.columns = [
        {
            header: "Pengawas",
            key: "supervisor",
            width: 20,
            style: setAlignment("middle", "center"),
        },
        { header: "Jadwal", key: "schedule", width: 20, style: setAlignment("middle", "center") },
        { header: "Nama", key: "name", width: 30, style: setAlignment("middle", "left") },
        { header: "NIP", key: "employeeId", width: 25, style: setAlignment("middle", "center") },
        { header: "Gol.", key: "category", width: 10, style: setAlignment("middle", "center") },
        { header: "TTD 1", key: "ttd1", width: 20, style: setAlignment("top", "left") },
        { header: "TTD 2", key: "ttd2", width: 20, style: setAlignment("top", "left") },
    ]
    data?.pickets.forEach((picket) => {
        const startRow = worksheet.lastRow ? worksheet.lastRow.number + 1 : 2
        const employees = picket.employees
        const fixedData = {
            supervisor: picket.supervisor,
            schedule: dateFormatter.longFullFormat.format(picket.schedule),
            ttd1: "1.",
            ttd2: "2.",
        }
        worksheet.addRow({
            ...fixedData,
            name: employees.first.name,
            employeeId: employees.first.employeeId,
            category: employees.first.category,
        })
        worksheet.addRow({
            ...fixedData,
            name: employees.second.name,
            employeeId: employees.second.employeeId,
            category: employees.second.category,
        })
        const endRow = startRow + 1
        worksheet.mergeCells(startRow, 1, endRow, 1)
        worksheet.mergeCells(startRow, 2, endRow, 2)
        worksheet.mergeCells(startRow, 6, endRow, 6)
        worksheet.mergeCells(startRow, 7, endRow, 7)
    })
    const headerRow = worksheet.getRow(1)
    headerRow.font = {
        bold: true,
        color: { argb: "FFFFFF" },
    }
    headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "0D9488" },
    }
    headerRow.alignment = { ...setAlignment("middle", "center").alignment }
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

const setTextAligment = (valign?: string, halign?: string) => {
    return {
        styles: { valign, halign },
    } as Partial<AutoTableStyles>
}

export const handleSavePicketToPdf = (
    data: PicketProps | null,
    title: string,
    fileName: string
) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    })
    const pageWidth = doc.internal.pageSize.getWidth()
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(title, pageWidth / 2, 15, { align: "center" })
    const tableHeaders = [["Pengawas", "Jadwal", "Nama", "NIP", "Gol.", "TTD 1", "TTD 2"]]
    const tableBody: AutoTableRowInput[] = []

    data?.pickets.forEach((picket) => {
        const schedule = dateFormatter.shortFullFormat.format(picket.schedule)
        const { first, second } = picket.employees
        tableBody.push([
            {
                content: picket.supervisor,
                rowSpan: 2,
                styles: setTextAligment("middle", "center"),
            },
            { content: schedule, rowSpan: 2, styles: setTextAligment("middle", "center") },
            first.name,
            first.employeeId,
            { content: first.category, styles: setTextAligment("middle", "center") },
            { content: "1.", styles: setTextAligment("top", "left") },
            null,
        ])
        tableBody.push([
            second.name,
            second.employeeId,
            { content: second.category, styles: setTextAligment("middle", "center") },
            null,
            { content: "2.", styles: setTextAligment("top", "left") },
        ])
    })
    autoTable(doc, {
        startY: 22,
        head: tableHeaders,
        body: tableBody,
        theme: "grid",
        headStyles: {
            fillColor: [13, 148, 136],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            ...setTextAligment("middle", "center"),
        },
        styles: { fontSize: 9, cellPadding: 3, ...setTextAligment("middle") },
        columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 23 },
            2: { cellWidth: 40 },
            3: { cellWidth: 40 },
            4: { cellWidth: 12 },
            5: { cellWidth: 22 },
            6: { cellWidth: 22 },
        },
    })
    doc.save(fileName)
}
