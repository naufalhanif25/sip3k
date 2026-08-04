"use client"

import { cn } from "@/app/lib/cn"
import { FormSectionProps } from "@/app/props/dashboard"

export default function FormSection({ title, className, children, ...props }: FormSectionProps) {
    return (
        <div className={cn(className, "flex flex-col items-start justify-center")} {...props}>
            <h5 className="font-semibold truncate max-w-full">{title}</h5>
            <span className={cn("w-full h-fit gap-3", "flex flex-col items-start justify-center")}>
                {children}
            </span>
        </div>
    )
}
