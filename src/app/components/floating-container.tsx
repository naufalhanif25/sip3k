"use client"

import { cn } from "@/app/lib/global-utils"
import { HTMLAttributes, useEffect, useState } from "react"
import { createPortal } from "react-dom"

export default function FloatingContainer({
    children,
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const handleSetMounted = () => {
            setMounted(true)
        }
        handleSetMounted()
    }, [])

    if (!mounted) return null
    return createPortal(
        <div
            className={cn(
                className,
                "fixed top-0 left-0 p-8",
                "flex items-center justify-center",
                "bg-black/50 overflow-hidden"
            )}
            {...props}
        >
            {children}
        </div>,
        document.body
    )
}
