"use client"

import { cn } from "@/app/lib/global-utils"
import { type DashboardSidebarButtonProps } from "@/app/props/dashboard"

export default function DashboardSidebarButton({
    title,
    icon,
    color,
    className,
    ...props
}: DashboardSidebarButtonProps) {
    return (
        <span
            className={cn("group flex items-center justify-start cursor-pointer", className)}
            style={{ color }}
            {...props}
        >
            {icon}
            <h4
                className={cn(
                    "group-hover:underline text-sm flex-1 text-left",
                    "truncate overflow-hidden"
                )}
            >
                {title}
            </h4>
        </span>
    )
}
