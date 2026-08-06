"use client"

import { cn } from "@/app/lib/cn"
import type { Property } from "csstype"
import { ExcelTableProps } from "@/app/props/dashboard"
import { CSSProperties } from "react"
import { ValueType } from "exceljs"

export default function ExcelTable({ data, merges, className, ...props }: ExcelTableProps) {
    const columnsToRender = data.data.columns.slice(0, 9)
    const rowsToRender = data.data.rows.slice(0, 36)

    return (
        <table className={cn(className, "border-collapse table-fixed overflow-hidden")} {...props}>
            <colgroup>
                {columnsToRender.map((col, index) => {
                    return (
                        <col
                            key={index}
                            style={{
                                width: `${Math.max(col.width * 8, 50)}px`,
                            }}
                        />
                    )
                })}
            </colgroup>
            <tbody>
                {rowsToRender.map((row, rowIndex) => {
                    return (
                        <tr key={rowIndex} className="text-xs h-6 w-full overflow-hidden">
                            {row.map((cell, colIndex) => {
                                const cellKey = `${rowIndex}-${colIndex}`
                                if (merges.hiddenCells.has(cellKey)) {
                                    return null
                                }
                                const mergeInfo = merges.mergeMap.get(cellKey)
                                const rawHorizontal = cell?.alignment?.horizontal
                                const fontFamily: Property.FontFamily = cell.font.name as string
                                const fontSize: Property.FontSize = `${cell.font.size}pt`
                                const textAlign: Property.TextAlign =
                                    rawHorizontal === "center" ||
                                    rawHorizontal === "right" ||
                                    rawHorizontal === "justify" ||
                                    rawHorizontal === "left"
                                        ? rawHorizontal
                                        : "left"
                                const isBold = Boolean(cell?.font?.bold)
                                const formattedValue =
                                    typeof cell.value === "object" && cell.value !== null
                                        ? JSON.stringify(cell.value)
                                        : String(cell.value)
                                const borderStyle: CSSProperties = {
                                    borderLeft: cell.border?.left
                                        ? "2px solid var(--color-black)"
                                        : "1px solid var(--color-gray-300)",
                                    borderRight: cell.border?.right
                                        ? "2px solid var(--color-black)"
                                        : "1px solid var(--color-gray-300)",
                                    borderTop: cell.border?.top
                                        ? "2px solid var(--color-black)"
                                        : "1px solid var(--color-gray-300)",
                                    borderBottom: cell.border?.bottom
                                        ? "2px solid var(--color-black)"
                                        : "1px solid var(--color-gray-300)",
                                }

                                return (
                                    <td
                                        key={colIndex}
                                        rowSpan={mergeInfo?.rowSpan || 1}
                                        colSpan={mergeInfo?.colSpan || 1}
                                        className="relative overflow-visible"
                                        style={{
                                            ...borderStyle,
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "absolute left-0 bottom-0 h-full z-10",
                                                "whitespace-pre flex items-center",
                                                "min-w-fit w-full"
                                            )}
                                            style={{
                                                fontFamily: fontFamily,
                                                fontSize: fontSize,
                                                justifyContent:
                                                    textAlign as Property.JustifyContent,
                                                textAlign: textAlign,
                                                fontWeight: isBold ? "bold" : "normal",
                                            }}
                                        >
                                            {cell.type === ValueType.Formula && "Rp"}{" "}
                                            {formattedValue}
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
