"use client"

import { cn } from "../lib/cn"
import { useState } from "react"
import { TextAreaProps } from "../props/component"

export default function TextArea({
    title,
    className,
    onChange,
    placeholder,
    ...props
}: TextAreaProps) {
    const [isFocus, setIsFocus] = useState<boolean>(false)

    return (
        <span className="flex flex-col gap-1 w-full h-fit">
            <h3 className={cn("text-sm font-medium text-black/75")}>{title}</h3>
            <span
                className={cn(
                    className,
                    "flex items-center justify-start",
                    "bg-indigo-50 rounded-md px-3 py-1 gap-2",
                    isFocus ? "outline-indigo-400 outline-2" : "outline-indigo-200 outline",
                    "overflow-hidden"
                )}
            >
                <textarea
                    onChange={onChange}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    className="h-full flex-1 outline-none resize-none"
                    placeholder={placeholder}
                    {...props}
                />
            </span>
        </span>
    )
}
