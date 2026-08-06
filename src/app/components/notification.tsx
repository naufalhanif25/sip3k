"use client"

import { cn } from "../lib/cn"
import { NotificationProps } from "../props/component"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

export default function Notification({
    title,
    description,
    type,
    onClose,
    className,
    ...props
}: NotificationProps) {
    const popupColor =
        type === "notification"
            ? "bg-indigo-200 border-indigo-300"
            : type === "error"
              ? "bg-red-200 border-red-300"
              : type === "warning"
                ? "bg-amber-200 border-amber-300"
                : "bg-indigo-200 border-indigo-300"
    const countdownColor =
        type === "notification"
            ? "bg-indigo-400"
            : type === "error"
              ? "bg-red-400"
              : type === "warning"
                ? "bg-amber-400"
                : "bg-indigo-400"
    const [progress, setProgress] = useState(100)

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setProgress(0)
        })
        const timeout = setTimeout(() => {
            onClose?.()
        }, 3000)

        return () => {
            cancelAnimationFrame(frame)
            clearTimeout(timeout)
        }
    }, [onClose])

    return (
        <span
            className={cn(
                className,
                "absolute top-3 right-3 min-w-80 max-w-80",
                "flex flex-col items-start justify-center",
                "border-2 overflow-hidden rounded-md z-999",
                popupColor
            )}
            {...props}
        >
            <span
                className={cn(
                    "w-full h-fit",
                    "flex flex-col items-start justify-center",
                    "overflow-hidden"
                )}
            >
                <span
                    className={cn(
                        "w-full h-fit gap-2",
                        "flex items-center justify-between",
                        "overflow-hidden"
                    )}
                >
                    <h4 className="font-semibold max-w-full truncate">{title}</h4>
                    <X onClick={onClose} className="size-4 cursor-pointer shrink-0" />
                </span>
                <h6 className="text-sm max-w-full line-clamp-3">{description}</h6>
                <span
                    className={cn(
                        "w-full h-1",
                        "absolute bottom-0 left-0",
                        "flex items-start justify-start"
                    )}
                >
                    <span
                        className={cn("h-full transition-[width] ease-linear", countdownColor)}
                        style={{
                            width: `${progress}%`,
                            transitionDuration: "3000ms",
                        }}
                    ></span>
                </span>
            </span>
        </span>
    )
}
