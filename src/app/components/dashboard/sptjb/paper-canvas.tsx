"use client"

import { cn } from "@/app/lib/global-utils"
import ExcelTable from "@/app/components/dashboard/sptjb/excel-table"
import FooterDisplay from "@/app/components/dashboard/sptjb/footer-display"
import { type PaperCanvasProps } from "@/app/props/sptjb"

export default function PaperCanvas({
    template,
    metadata,
    page,
    totalPages,
    className,
    ...props
}: PaperCanvasProps) {
    return (
        <span
            className={cn(
                className,
                "flex items-start justify-start",
                "break-after-page print:break-after-page",
                "print:m-0 print:p-0 print:w-full print:h-screen",
                "bg-white"
            )}
            {...props}
        >
            <div className="w-fit h-full flex flex-col items-start justify-between">
                <ExcelTable className="w-min h-fit" data={page.renderData} merges={page.merges} />
                <FooterDisplay
                    className="w-full h-fit"
                    style={{
                        fontFamily: template.data.headerFooter.font.name,
                        fontSize: `${template.data.headerFooter.font.size}pt`,
                    }}
                    metadata={{
                        ...metadata,
                        pageNumber: page.pageNumber,
                        totalPages: totalPages,
                    }}
                    text={template.data.headerFooter.oddFooter}
                />
            </div>
        </span>
    )
}
