"use client"

import { useFocus } from "@/app/hooks/component"
import { cn } from "@/app/lib/global-utils"
import { InputHTMLAttributes } from "react"

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    parentClassName?: string
}

export default function TextInput({ type, parentClassName, className, ...props }: TextInputProps) {
    const { isFocus, handleFocus, handleUnfocus } = useFocus()

    return (
        <span
            className={cn(
                parentClassName,
                "flex items-center justify-start",
                "bg-indigo-50 overflow-hidden rounded-md",
                isFocus ? "border-indigo-400 border-2" : "border-indigo-200 border"
            )}
        >
            <input
                onFocus={handleFocus}
                onBlur={handleUnfocus}
                className={cn(className, "w-full h-full outline-none text-sm")}
                type={type || "text"}
                {...props}
            />
        </span>
    )
}
