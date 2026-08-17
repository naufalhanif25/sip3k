import { ChangeEvent } from "react"
import { type ParsedMergeProps, type ExcelMergeInfoProps } from "@/app/props/sptjb"

export const nullableNumberChangeHandler = (
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
    index: number,
    callback: (value: string, index: number) => void
) => {
    let value = event.target.value
    value = value.replace(/\D/g, "")
    value = value.replace(/^0+(?=\d)/, "")

    callback(value, index)
}

export function parseMergeRanges(merges: string[]): ParsedMergeProps {
    const mergeMap = new Map<string, ExcelMergeInfoProps>()
    const hiddenCells = new Set<string>()

    merges.map((range) => {
        const [start, end] = range.split(":")
        const startCol = start.match(/[A-Z]+/)?.[0]
        const startRow = parseInt(start.match(/\d+/)?.[0] || "0", 10) - 1
        const endCol = end.match(/[A-Z]+/)?.[0]
        const endRow = parseInt(end.match(/\d+/)?.[0] || "0", 10) - 1
        if (!startCol || !endCol) return

        const colToIndex = (col: string): number =>
            col.split("").reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1
        const startColIndex = colToIndex(startCol)
        const endColIndex = colToIndex(endCol)
        const rowSpan = endRow - startRow + 1
        const colSpan = endColIndex - startColIndex + 1
        mergeMap.set(`${startRow}-${startColIndex}`, { rowSpan, colSpan })

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startColIndex; col <= endColIndex; col++) {
                if (row !== startRow || col !== startColIndex) {
                    hiddenCells.add(`${row}-${col}`)
                }
            }
        }
    })
    return { mergeMap, hiddenCells }
}
