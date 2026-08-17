import { type ExcelCellProps, type TemplateGetResponseProps } from "@/app/props/api"
import { type ProcessedTableResultProps, ProcessedTableResult } from "@/app/props/sptjb"
import { type FormInputProps, type SPTJBMetadataProps } from "@/app/props/sptjb"
import { parseMergeRanges } from "@/app/lib/utils-handler"
import { dateFormatter } from "@/app/lib/global-utils"
import { currencyFormatter } from "@/app/lib/sptjb-utils-handler"
import { dateTZ } from "@/app/lib/date-timezone"

export function replacePlaceholders(
    value: string | number | Date | null | undefined,
    metadata: SPTJBMetadataProps
): string | number | Date | null | undefined {
    if (typeof value !== "string" || !metadata) return value
    return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
        return metadata[key] !== undefined ? String(metadata[key]) : match
    })
}

export function generateDynamicSPTJBTable(
    template: TemplateGetResponseProps | null,
    formData: FormInputProps[],
    metadata: SPTJBMetadataProps = {},
    anchorRow: number = 20
): ProcessedTableResultProps {
    if (!template) {
        return ProcessedTableResult.parse({
            rows: [],
            merges: { mergeMap: new Map(), hiddenCells: new Set() },
        })
    }
    const originalRows = template.data.rows
    const templateRow = originalRows[anchorRow] || originalRows[originalRows.length - 1]
    const topRows = originalRows.slice(0, anchorRow)
    const dynamicRows: ExcelCellProps[][] = formData.map((item, index) => {
        const newRow: ExcelCellProps[] = templateRow.map((cell) => ({
            ...cell,
            value: "",
            font: { ...cell.font },
            alignment: { ...cell.alignment },
            border: { ...cell.border },
        }))
        if (newRow[0]) newRow[0].value = index + 1 || 1
        if (newRow[1]) newRow[1].value = item.code || 0
        if (newRow[2]) newRow[2].value = item.name || ""
        if (newRow[3]) newRow[3].value = item.description || ""
        if (newRow[4])
            newRow[4].value = item.date
                ? dateFormatter.shortFullFormat.format(dateTZ.getTZDate(item.date)).replaceAll(/\s/g, "-")
                : ""
        if (newRow[5]) newRow[5].value = item.id || 0
        if (newRow[6]) newRow[6].value = `Rp ${currencyFormatter.format(item.total || 0)}`
        if (newRow[7]) newRow[7].value = `Rp ${currencyFormatter.format(item.ppn || 0)}`
        if (newRow[8]) newRow[8].value = `Rp ${currencyFormatter.format(item.pph || 0)}`
        return newRow
    })
    const bottomRows = originalRows.slice(anchorRow + 1)
    const rawFinalRows = [...topRows, ...dynamicRows, ...bottomRows]
    const finalRows = rawFinalRows.map((row) =>
        row.map((cell) => {
            if (typeof cell.value === "string" && cell.value.includes("{{")) {
                return {
                    ...cell,
                    value: replacePlaceholders(cell.value, metadata),
                }
            }
            return cell
        })
    )
    const addedRowsCount = Math.max(0, formData.length - 1)
    const originalMerges = template.data.merges || []
    const adjustedMerges: string[] = originalMerges.map((range: string) => {
        const [start, end] = range.split(":")
        const startCol = start.match(/[A-Z]+/)?.[0] || ""
        let startRow = parseInt(start.match(/\d+/)?.[0] || "1", 10) - 1
        const endCol = end.match(/[A-Z]+/)?.[0] || ""
        let endRow = parseInt(end.match(/\d+/)?.[0] || "1", 10) - 1

        if (startRow > anchorRow) {
            startRow += addedRowsCount
            endRow += addedRowsCount
        } else if (startRow <= anchorRow && endRow >= anchorRow) {
            endRow += addedRowsCount
        }
        return `${startCol}${startRow + 1}:${endCol}${endRow + 1}`
    })
    const merges = parseMergeRanges(adjustedMerges)

    return ProcessedTableResult.parse({
        rows: finalRows,
        merges,
    })
}
