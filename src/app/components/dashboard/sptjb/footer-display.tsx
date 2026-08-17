"use client"

import { cn } from "@/app/lib/global-utils"
import { type FooterDisplayProps } from "@/app/props/sptjb"
import { parseExcelHeaderFooter } from "@/app/lib/sptjb-canvas-helper"

export default function FooterDisplay({ metadata, text, className, ...props }: FooterDisplayProps) {
    const { left, center, right } = parseExcelHeaderFooter(metadata, text)

    return (
        <div
            className={cn(className, "flex items-start justify-between", "overflow-hidden")}
            {...props}
        >
            <div className="flex-1 text-left whitespace-pre-wrap">{left}</div>
            <div className="flex-1 text-center whitespace-pre-wrap">{center}</div>
            <div className="flex-1 text-right whitespace-pre-wrap">{right}</div>
        </div>
    )
}
