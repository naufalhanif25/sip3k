"use client"

import { cn } from "@/app/lib/global-utils"
import { type RoundButtonProps } from "@/app/props/dashboard"

export default function RoundButton({ icon, className, ...props }: RoundButtonProps) {
    return (
        <span
            className={cn(
                className,
                "rounded-full flex items-center justify-center",
                "cursor-pointer"
            )}
            {...props}
        >
            {icon}
        </span>
    )
}
