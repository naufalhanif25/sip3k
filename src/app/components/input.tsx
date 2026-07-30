"use client"

import { cn } from "@/app/lib/cn"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { HomeInputProps } from "../props/component"

export default function Input({
    title,
    placeholder,
    onChange,
    type,
    className,
    ...props
}: HomeInputProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false)
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
                <input
                    onChange={onChange}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    type={type === "password" && !showPassword ? type : "text"}
                    className="h-full flex-1 outline-none"
                    placeholder={placeholder}
                    {...props}
                />
                {type === "password" && (
                    <span
                        onClick={() => setShowPassword((prev) => !prev)}
                        className={cn(
                            "h-full aspect-square p-1.5 cursor-pointer",
                            "flex items-center justify-center overflow-hidden"
                        )}
                    >
                        {showPassword ? (
                            <EyeOff className="size-full shrink-0 text-indigo-400" />
                        ) : (
                            <Eye className="size-full shrink-0 text-indigo-400" />
                        )}
                    </span>
                )}
            </span>
        </span>
    )
}
