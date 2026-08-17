"use client"

import { cn } from "@/app/lib/global-utils"
import Button from "@/app/components/button"
import { Phone } from "lucide-react"
import { type PicketBoxProps } from "@/app/props/picket"

export default function PicketBox({
    className,
    name,
    employeeId,
    category,
    onRemind,
    ...props
}: PicketBoxProps) {
    return (
        <span
            className={cn(
                className,
                "rounded-lg overflow-hidden gap-3",
                "flex items-center justify-start",
                "bg-indigo-200 border-2 border-indigo-300"
            )}
            {...props}
        >
            <span
                className={cn(
                    "flex-1 w-fit",
                    "flex flex-col items-start justify-start",
                    "overflow-hidden"
                )}
            >
                <span className={cn("w-full h-fit gap-2", "flex items-center overflow-hidden")}>
                    <h5 className="text-lg font-semibold truncate">{name}</h5>
                    <h6 className="font-semibold text-nowrap">({category})</h6>
                </span>
                <h6 className="text-sm truncate max-w-full">{employeeId}</h6>
            </span>
            <span
                className={cn(
                    "w-fit shrink-0 h-fit gap-2",
                    "flex items-center justify-center",
                    "overflow-hidden"
                )}
            >
                <Button
                    onClick={() => onRemind && onRemind()}
                    className="w-fit px-5 py-1 h-10 gap-2"
                >
                    <Phone className="size-4 text-white shrink-0" />
                    <p className="hidden xs:block">Panggil</p>
                </Button>
            </span>
        </span>
    )
}
