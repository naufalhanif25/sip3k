"use client"

import { cn } from "@/app/lib/global-utils"
import { type EmployeeFormPopupProps } from "@/app/props/picket"

export default function EmployeeFormPopup({
    title,
    body,
    footer,
    className,
    ...props
}: EmployeeFormPopupProps) {
    return (
        <div
            className={cn(
                className,
                "flex flex-col items-start justify-start",
                "rounded-lg bg-indigo-50"
            )}
            {...props}
        >
            <span className={cn("px-5 py-3 w-full h-fit", "bg-indigo-200")}>
                <h3 className="font-semibold max-w-full truncate">{title}</h3>
            </span>
            <span className={cn("w-full flex-1 gap-2", "flex flex-col items-start justify-start")}>
                {body}
            </span>
            <span
                className={cn(
                    "w-full h-fit gap-2",
                    "flex items-center justify-start",
                    "overflow-hidden"
                )}
            >
                {footer}
            </span>
        </div>
    )
}
