"use client"

import { cn } from "../lib/cn"
import Button from "./button"
import { InfoPopupProps } from "../props/component"
import { X } from "lucide-react"

export default function InfoPopup({
    title,
    description,
    dismissTitle,
    acceptTitle,
    onDismiss,
    onAccept,
    onClose,
    className,
    ...props
}: InfoPopupProps) {
    return (
        <div
            className={cn(
                className,
                "flex flex-col items-center justify-start",
                "overflow-hidden bg-indigo-50 rounded-md"
            )}
            {...props}
        >
            <span className={cn("w-full h-fit gap-2", "flex flex-col items-center justify-center")}>
                <span
                    className={cn(
                        "w-full h-fit relative gap-2",
                        "flex items-center justify-center"
                    )}
                >
                    <h4 className="font-semibold max-w-full text-center truncate">{title}</h4>
                    <span
                        onClick={onClose}
                        className={cn(
                            "aspect-square h-8 cursor-pointer",
                            "flex items-center justify-center",
                            "absolute right-0 bg-indigo-50"
                        )}
                    >
                        <X className="shrink-0 size-4" />
                    </span>
                </span>
                <p className="text-sm max-w-full line-clamp-5 text-center">{description}</p>
            </span>
            <span className={cn("w-full h-fit gap-2", "flex items-center justify-center")}>
                <Button onClick={onDismiss} className="flex-1 px-3 py-1 h-10 gap-2 overflow-hidden">
                    <p className="max-w-full truncate">{dismissTitle || "Abaikan"}</p>
                </Button>
                <Button onClick={onAccept} className="flex-1 px-3 py-1 h-10 gap-2 overflow-hidden">
                    <p className="max-w-full truncate">{acceptTitle || "Setuju"}</p>
                </Button>
            </span>
        </div>
    )
}
