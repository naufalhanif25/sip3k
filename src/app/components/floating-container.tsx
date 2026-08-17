"use client"

import { cn } from "@/app/lib/global-utils"
import { HTMLAttributes } from "react"

export default function FloatingContainer({
    children,
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                className,
                "absolute top-0 left-0 p-8",
                "flex items-center justify-center",
                "bg-black/50 overflow-hidden"
            )}
            {...props}
        >
            {children}
        </div>
    )
}
