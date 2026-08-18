"use client"

import { cn } from "@/app/lib/global-utils"
import { useEffect, useRef, useState } from "react"
import { type DayPickerInputProps } from "@/app/props/component"
import DayPicker from "@/app/components/day-picker"
import { Calendar } from "lucide-react"
import { dateFormatter } from "@/app/lib/global-utils"

export default function DayPickerInput({
    title,
    value,
    onChange,
    className,
    ...props
}: DayPickerInputProps) {
    const dayPickerRef = useRef<HTMLSpanElement | null>(null)
    const [showCalendar, setShowCalendar] = useState<boolean>(false)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dayPickerRef.current && !dayPickerRef.current.contains(event.target as Node)) {
                setShowCalendar(false)
            }
        }
        if (showCalendar) document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [showCalendar])

    return (
        <span ref={dayPickerRef} className="flex flex-col w-full h-fit relative">
            {showCalendar && (
                <DayPicker
                    className="absolute w-fit h-fit p-5 left-0 bottom-12 gap-2 z-150"
                    defaultDate={value}
                    selected={value}
                    onSelect={(date) => {
                        if (onChange) onChange(date)
                        setShowCalendar((prev) => !prev)
                    }}
                />
            )}
            <span className="flex flex-col gap-1 w-full h-fit">
                <h3 className={cn("text-sm font-medium text-black/75")}>{title}</h3>
                <span
                    className={cn(
                        className,
                        "flex items-center justify-start",
                        "bg-indigo-50 rounded-md px-3 py-1 gap-2",
                        showCalendar
                            ? "outline-indigo-400 outline-2"
                            : "outline-indigo-200 outline",
                        "overflow-hidden"
                    )}
                >
                    <span
                        onClick={() => setShowCalendar((prev) => !prev)}
                        className={cn(
                            "flex-1 h-fit gap-2 px-2 py-1",
                            "flex items-center justify-between",
                            "overflow-hidden cursor-pointer"
                        )}
                        {...props}
                    >
                        <p className="max-w-full truncate">
                            {dateFormatter.defultFormat.format(value)}
                        </p>
                        <Calendar className="size-4 shrink-0" />
                    </span>
                </span>
            </span>
        </span>
    )
}
