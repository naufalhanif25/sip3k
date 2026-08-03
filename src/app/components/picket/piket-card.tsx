"use client"

import { cn } from "@/app/lib/cn"
import { Check, Phone } from "lucide-react"
import { PiketCardProps } from "@/app/props/picket"

export default function PiketCard({
    pegawai,
    onSelesai,
    onIngatkan,
    className,
    ...props
}: PiketCardProps) {
    return (
        <span
            className={cn(
                className,
                "flex flex-col items-start justify-start gap-3",
                "bg-indigo-100 border-2 border-indigo-300",
                "rounded-lg p-4 overflow-hidden"
            )}
            {...props}
        >
            <span className="w-full flex flex-col overflow-hidden">
                <h4 className="text-base font-semibold w-full truncate">{pegawai.nama}</h4>
                <p className="text-xs text-black/50 w-full truncate">{pegawai.nip}</p>
            </span>
            <span className="w-full flex items-center justify-start gap-2">
                <button
                    onClick={onSelesai}
                    className={cn(
                        "flex items-center justify-center gap-1.5",
                        "px-3 py-2 rounded-md",
                        "bg-indigo-400 hover:bg-indigo-500",
                        "text-white text-xs font-medium",
                        "cursor-pointer transition ease-out duration-100"
                    )}
                >
                    <Check strokeWidth={2} className="size-3.5 shrink-0" />
                    Selesai
                </button>
                <button
                    onClick={onIngatkan}
                    className={cn(
                        "flex items-center justify-center gap-1.5",
                        "px-3 py-2 rounded-md",
                        "bg-indigo-400 hover:bg-indigo-500",
                        "text-white text-xs font-medium",
                        "cursor-pointer transition ease-out duration-100"
                    )}
                >
                    <Phone strokeWidth={2} className="size-3.5 shrink-0" />
                    Ingatkan
                </button>
            </span>
        </span>
    )
}
