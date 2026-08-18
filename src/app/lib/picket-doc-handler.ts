import ExcelJS from "exceljs"
import { type PicketProps } from "@/app/props/db"
import { dateFormatter } from "@/app/lib/global-utils"
import jsPDF from "jspdf"
import autoTable, { RowInput as AutoTableRowInput } from "jspdf-autotable"

export const handleSavePicketToExcel = async (
    data: PicketProps | null,
    fileName: string,
    sheetName?: string
) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(sheetName)
    worksheet.columns = [
        {
            header: "HARI/TANGGAL",
            key: "schedule",
            width: 30,
            style: { alignment: { vertical: "middle", horizontal: "center" } },
        },
        {
            header: "PENGAWAS PIKET",
            key: "supervisor",
            width: 20,
            style: { alignment: { vertical: "middle", horizontal: "center" } },
        },
        {
            header: "WIRA/KOMANDAN PIKET",
            key: "name1",
            width: 30,
            style: { alignment: { vertical: "middle", horizontal: "center" } },
        },
        {
            header: "DARMA/ANGGOTA PIKET",
            key: "name2",
            width: 30,
            style: { alignment: { vertical: "middle", horizontal: "center" } },
        },
    ]
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
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    })
    const pageWidth = doc.internal.pageSize.getWidth()
    doc.setFontSize(10)
    doc.setFont("times")
    doc.text(title, pageWidth / 2, 15, { align: "center" })
    const tableHeaders = [
        ["HARI/TANGGAL", "PENGAWAS PIKET", "WIRA/KOMANDAN PIKET", "DARMA/ANGGOTA PIKET"],
        ["1", "2", "3", "4"],
    ]
    const tableBody: AutoTableRowInput[] = []

    data?.pickets.forEach((picket) => {
        const weekday = dateFormatter.longWeekdayFormat.format(picket.schedule)
        const date = dateFormatter.longFullFormat.format(picket.schedule)

        tableBody.push([
            {
                content: `${weekday} / ${date}`,
                styles: { valign: "middle", halign: "left", font: "times" },
            },
            {
                content: picket.supervisor,
                styles: { valign: "middle", halign: "center", font: "times" },
            },
            {
                content: picket.employees.first.name,
                styles: { valign: "middle", halign: "center", font: "times" },
            },
            {
                content: picket.employees.second.name,
                styles: { valign: "middle", halign: "center", font: "times" },
            },
        ])
    })
    autoTable(doc, {
        startY: 24,
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
            if (hookData.section === "head") {
                if (hookData.row.index === 1) {
                    hookData.cell.styles.cellPadding = 0
                }
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
        columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 40 },
            2: { cellWidth: 50 },
            3: { cellWidth: 50 },
        },
    })
    doc.save(fileName)
}
