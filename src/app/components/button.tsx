"use client"

import { cn } from "../lib/cn"
import { HTMLAttributes } from "react"

export default function Button({
    className,
    children,
    ...props
}: HTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn(
                className,
                "text-sm rounded-md",
                "bg-indigo-400 hover:bg-indigo-500 text-white",
                "transition ease-out duration-100",
                "flex items-center justify-center gap-2",
                "cursor-pointer shrink-0"
            )}
            {...props}
        >
            {children}
        </button>
    )
}
