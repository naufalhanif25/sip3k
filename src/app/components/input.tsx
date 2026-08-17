"use client"

import { cn } from "@/app/lib/global-utils"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { type InputProps } from "@/app/props/component"
import { useFocus } from "@/app/hooks/component"

export default function Input({
    title,
    placeholder,
    onChange,
    type,
    className,
    pattern,
    ...props
}: InputProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const handleSetPasswordState = () => setShowPassword((prev) => !prev)
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
                {type === "currency" && (
                    <span
                        onClick={handleSetPasswordState}
                        className={cn(
                            "h-full aspect-square cursor-pointer shrink-0",
                            "flex items-center justify-center overflow-hidden"
                        )}
                    >
                        <h6 className="text-sm">Rp</h6>
                    </span>
                )}
                <input
                    onChange={(event) => onChange && onChange(event)}
                    onFocus={handleFocus}
                    onBlur={handleUnfocus}
                    type={
                        type === "password"
                            ? !showPassword
                                ? type
                                : "text"
                            : type === "currency"
                              ? "text"
                              : type
                    }
                    pattern={type === "currency" ? "^\\d{1,3}(\\.\\d{3})*$" : pattern}
                    className="h-full flex-1 outline-none"
                    placeholder={placeholder}
                    {...props}
                />
                {type === "password" && (
                    <span
                        onClick={handleSetPasswordState}
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
