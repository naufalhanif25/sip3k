"use client"

import { cn } from "@/app/lib/cn"
import Button from "../button"
import { CheckCheck, Phone } from "lucide-react"
import { PicketBoxProps } from "@/app/props/dashboard"

export default function PicketBox({
    className,
    name,
    nip,
    lastRemind,
    onDone,
    onRemind,
    ...props
}: PicketBoxProps) {
    return (
        <span
            className={cn(
                className,
                "rounded-lg overflow-hidden gap-3",
                "flex flex-col items-start justify-start",
                "bg-indigo-200 border-2 border-indigo-300"
            )}
            {...props}
        >
            <span
                className={cn(
                    "w-full flex-1 max-w-full",
                    "flex flex-col items-start justify-start",
                    "overflow-hidden"
                )}
            >
                <span className="w-full h-fit flex gap-4">
                    <h5 className="flex-1 text-lg font-semibold truncate max-w-full">{name}</h5>
                    {lastRemind && (
                        <p className="flex-1 max-w-32 text-xs text-right truncate text-black/50">
                            Dipanggil {lastRemind}
                        </p>
                    )}
                </span>
                <h6 className="text-sm truncate max-w-full">{nip}</h6>
            </span>
            <span
                className={cn(
                    "w-full h-fit gap-2",
                    "flex items-center justify-center",
                    "overflow-hidden"
                )}
            >
                <Button onClick={onDone} className="flex-1 px-3 py-1 h-10 gap-2">
                    <CheckCheck className="size-4 text-white shrink-0" />
                    <p className="hidden xs:block">Selesai</p>
                </Button>
                <Button onClick={onRemind} className="flex-1 px-3 py-1 h-10 gap-2">
                    <Phone className="size-4 text-white shrink-0" />
                    <p className="hidden xs:block">Ingatkan</p>
                </Button>
            </span>
        </span>
    )
}
