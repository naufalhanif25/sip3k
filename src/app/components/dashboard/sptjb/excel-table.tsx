"use client"

import { cn } from "@/app/lib/global-utils"
import type { Property } from "csstype"
import { type ExcelTableProps } from "@/app/props/sptjb"
import { CSSProperties } from "react"
import { TEMPLATE_BOUND } from "@/app/vars/global-vars"

export default function ExcelTable({ data, merges, className, ...props }: ExcelTableProps) {
    const columnsToRender = data.data.columns.slice(0, TEMPLATE_BOUND.column)
    const rowsToRender = data.data.rows.slice(0, TEMPLATE_BOUND.row)

    return (
        <table className={cn(className, "border-collapse table-fixed")} {...props}>
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
                    const hasWrapText = row.some((cell) => cell?.alignment?.wrapText)

                    return (
                        <tr
                            key={rowIndex}
                            className={cn(
                                "text-xs w-full overflow-hidden",
                                hasWrapText ? "h-auto" : "h-6"
                            )}
                        >
                            {row.map((cell, colIndex) => {
                                const cellKey = `${rowIndex}-${colIndex}`
                                if (merges.hiddenCells.has(cellKey)) {
                                    return null
                                }
                                const mergeInfo = merges.mergeMap.get(cellKey)
                                const rawHorizontal = cell?.alignment?.horizontal
                                const isTextWrap = cell?.alignment?.wrapText
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
                                        : "none",
                                    borderRight: cell.border?.right
                                        ? "2px solid var(--color-black)"
                                        : "none",
                                    borderTop: cell.border?.top
                                        ? "2px solid var(--color-black)"
                                        : "none",
                                    borderBottom: cell.border?.bottom
                                        ? "2px solid var(--color-black)"
                                        : "none",
                                }

                                return (
                                    <td
                                        key={colIndex}
                                        rowSpan={mergeInfo?.rowSpan || 1}
                                        colSpan={mergeInfo?.colSpan || 1}
                                        className={cn(
                                            "relative",
                                            isTextWrap ? "overflow-hidden" : "overflow-visible"
                                        )}
                                        style={{
                                            ...borderStyle,
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "z-10 flex items-center w-full",
                                                isTextWrap
                                                    ? "relative whitespace-pre-wrap wrap-break-word min-h-6 h-auto overflow-hidden"
                                                    : "absolute inset-0 h-full whitespace-pre overflow-visible min-w-full"
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
