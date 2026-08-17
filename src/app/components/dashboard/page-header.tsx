"use client"

import { cn } from "@/app/lib/global-utils"
import { type PageHeaderProps } from "@/app/props/dashboard"

export default function PageHeader({ title, description, className, ...props }: PageHeaderProps) {
    return (
        <div
            className={cn(
                className,
                "py-2 px-4",
                "flex flex-col items-start justify-center",
                "bg-indigo-100 border-b-2 border-indigo-300"
            )}
            {...props}
        >
            <h2 className="text-lg font-semibold w-full truncate">{title}</h2>
            <h4 className="text-xs w-full line-clamp-2">{description}</h4>
        </div>
    )
}
