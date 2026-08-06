"use client"

import { cn } from "@/app/lib/cn"
import { Check } from "lucide-react"
import { CheckBoxProps } from "../props/component"

export default function CheckBox({ className, onClick, title, active, ...props }: CheckBoxProps) {
    return (
        <span
            onClick={onClick}
            className={cn(className, "flex justify-center items-center", "cursor-pointer")}
        >
            <span
                className={cn(
                    "border rounded-sm border-black/50 size-4",
                    "flex items-center justify-center",
                    "cursor-pointer p-[1%]"
                )}
                {...props}
            >
                {active && (
                    <span
                        className={cn(
                            "w-full h-full bg-indigo-400 rounded-xs",
                            "overflow-hidden flex items-center justify-center",
                            "shrink-0 aspect-square"
                        )}
                    >
                        <Check size={8} strokeWidth={3} className="text-white" />
                    </span>
                )}
            </span>
            {title && <p className="text-xs text-black/50 ">{title}</p>}
        </span>
    )
}
