"use client"

import { cn } from "../lib/cn"
import { DropdownProps, DropdownButtonProps } from "../props/component"

export function DropdownButton({ title, icon, color, className, ...props }: DropdownButtonProps) {
    return (
        <button
            className={cn(
                className,
                "flex items-center justify-start",
                "overflow-hidden hover:bg-indigo-300",
                "text-sm cursor-pointer hover:underline",
                "transition ease-out duration-50",
                "rounded-sm"
            )}
            style={{ color }}
            {...props}
        >
            {icon}
            {title}
        </button>
    )
}

export function Dropdown({ children, className, ...props }: DropdownProps) {
    return (
        <span
            className={cn(
                className,
                "absolute top-10 right-2",
                "flex flex-col rounded-md",
                "bg-indigo-200 border-2 border-indigo-300"
            )}
            {...props}
        >
            <span className={cn("w-full h-fit", "flex flex-col items-center justify-start")}>
                {children}
            </span>
        </span>
    )
}
