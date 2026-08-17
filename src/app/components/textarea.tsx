"use client"

import { cn } from "@/app/lib/global-utils"
import { type TextAreaProps } from "@/app/props/component"
import { useFocus } from "@/app/hooks/component"

export default function TextArea({
    title,
    className,
    onChange,
    placeholder,
    ...props
}: TextAreaProps) {
    const { isFocus, handleFocus, handleUnfocus } = useFocus()

    return (
        <span className="flex flex-col gap-1 w-full h-fit">
            {title && <h3 className={cn("text-sm font-medium text-black/75")}>{title}</h3>}
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
                    onChange={(event) => onChange && onChange(event)}
                    onFocus={handleFocus}
                    onBlur={handleUnfocus}
                    className="h-full flex-1 outline-none resize-none"
                    placeholder={placeholder}
                    {...props}
                />
            </span>
        </span>
    )
}
