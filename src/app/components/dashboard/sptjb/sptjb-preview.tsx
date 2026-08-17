"use client"

import { cn } from "@/app/lib/global-utils"
import { PaperCanvasRenderData, type SPTJBPreviewProps } from "@/app/props/sptjb"
import Button from "@/app/components/button"
import { useState, useMemo, forwardRef } from "react"
import { Expand, Shrink, ZoomIn, ZoomOut } from "lucide-react"
import { generateDynamicSPTJBTable } from "@/app/lib/sptjb-table-helper"
import { TemplateGetResponse } from "@/app/props/api"
import PaperCanvas from "@/app/components/dashboard/sptjb/paper-canvas"
import { MAX_ROW_PERPAGE } from "@/app/vars/global-vars"

export const SPTJBPreview = forwardRef<HTMLDivElement, SPTJBPreviewProps>(function SPTJBPreview(
    { data, template, formData, metadata, className, ...props },
    ref
) {
    const [excelScale, setExcelScale] = useState<number>(100)
    const pagesData = useMemo(() => {
        if (!template) return []
        const chunks = []
        for (let index = 0; index < formData.length; index += MAX_ROW_PERPAGE) {
            chunks.push(formData.slice(index, index + MAX_ROW_PERPAGE))
        }
        if (chunks.length === 0) chunks.push([])
        return chunks.map((chunk, pageIndex) => {
            const dynamicTableData = generateDynamicSPTJBTable(template, chunk, metadata, 20)
            const startIndex = pageIndex * MAX_ROW_PERPAGE
            const adjustedRows = dynamicTableData.rows.map((row, rIdx) => {
                if (rIdx >= 20 && rIdx < 20 + chunk.length) {
                    const newRow = [...row]
                    if (newRow[0]) {
                        newRow[0] = {
                            ...newRow[0],
                            value: startIndex + (rIdx - 20) + 1,
                        }
                    }
                    return newRow
                }
                return row
            })
            const renderData = TemplateGetResponse.parse({
                ...template,
                data: {
                    ...template.data,
                    rows: adjustedRows,
                },
            })
            return PaperCanvasRenderData.parse({
                renderData,
                merges: dynamicTableData.merges,
                pageNumber: pageIndex + 1,
            })
        })
    }, [formData, template, metadata])

    if (!template)
        return (
            <div
                className={cn(
                    className,
                    "bg-indigo-100 rounded-lg overflow-hidden",
                    "border-2 border-indigo-400",
                    "flex items-center justify-center"
                )}
                {...props}
            >
                <h4 className="text-md max-w-full truncate text-black/50">Memuat Pratinjau...</h4>
            </div>
        )
    const handleZoomIn = () => {
        setExcelScale((prev) => {
            const target = prev + 10
            return target >= 200 ? 200 : target
        })
    }
    const handleZoomToFit = () => {
        setExcelScale(100)
    }
    const handleZoomOut = () => {
        setExcelScale((prev) => {
            const target = prev - 10
            return target <= 10 ? 10 : target
        })
    }

    return (
        <div
            className={cn(
                className,
                "bg-indigo-100 rounded-lg overflow-hidden",
                "border-2 border-indigo-400",
                "flex flex-col items-start justify-start"
            )}
            {...props}
        >
            <div
                className={cn(
                    "w-full h-fit px-4 py-3",
                    "bg-indigo-400 text-white",
                    "flex flex-col items-start justify-start",
                    "overflow-hidden"
                )}
            >
                <h4 className="text-sm truncate max-w-full">Pratinjau Dokumen</h4>
                <p className="text-xs text-white/75">{data.name || "Dokumen Tanpa Nama"}</p>
            </div>
            <div
                className={cn(
                    "w-full flex-1 overflow-hidden",
                    "flex items-start justify-start",
                    "relative"
                )}
            >
                <div
                    ref={ref}
                    className={cn(
                        "w-full h-full gap-5",
                        "flex print:flex-col items-start justify-start",
                        "overflow-auto overscroll-none",
                        "print:overflow-visible print:h-auto"
                    )}
                >
                    {template?.data && pagesData.length > 0 ? (
                        pagesData.map((page, index) => {
                            return (
                                <PaperCanvas
                                    className="aspect-[1/1.414] w-fit p-8"
                                    style={{
                                        zoom: `${excelScale}%`,
                                    }}
                                    key={index}
                                    template={template}
                                    metadata={metadata}
                                    totalPages={pagesData.length}
                                    page={page}
                                />
                            )
                        })
                    ) : (
                        <span
                            className={cn(
                                "w-full h-full p-5",
                                "flex items-center justify-center",
                                "overflow-hidden"
                            )}
                        >
                            <h3 className="max-w-50 text-center text-black/50">
                                Tidak ada dokumen untuk ditampilkan
                            </h3>
                        </span>
                    )}
                </div>
                <span
                    className={cn(
                        "absolute bottom-4 left-2",
                        "w-fit h-fit gap-2 z-10",
                        "flex flex-col items-center justify-center",
                        "overflow-hidden"
                    )}
                >
                    <Button onClick={handleZoomIn} className="aspect-square h-8 w-fit text-sm">
                        <ZoomIn className="size-4 shrink-0" />
                    </Button>
                    <span
                        className={cn(
                            "group w-fit h-fit rounded-md",
                            "flex items-center justify-center",
                            "relative overflow-hidden"
                        )}
                    >
                        <span
                            className={cn(
                                "border-2 border-indigo-400 bg-indigo-50 rounded-md",
                                "h-8 aspect-square",
                                "flex items-center justify-center",
                                "overflow-hidden"
                            )}
                        >
                            <p className="max-w-full truncate text-xs">{excelScale}</p>
                        </span>
                        {excelScale !== 100 && (
                            <Button
                                onClick={handleZoomToFit}
                                className={cn(
                                    "absolute left-0 bottom-0 z-10",
                                    "aspect-square h-8 w-fit text-sm",
                                    "group-hover:opacity-100 opacity-0"
                                )}
                            >
                                {excelScale < 100 ? (
                                    <Expand className="size-4 shrink-0" />
                                ) : excelScale > 100 ? (
                                    <Shrink className="size-4 shrink-0" />
                                ) : null}
                            </Button>
                        )}
                    </span>
                    <Button onClick={handleZoomOut} className="aspect-square h-8 w-fit text-sm">
                        <ZoomOut className="size-4 shrink-0" />
                    </Button>
                </span>
            </div>
        </div>
    )
})
