"use client"

import { cn } from "../lib/cn"
import { useState, HTMLAttributes } from "react"
import DayPicker from "./day-picker"
import { Calendar } from "lucide-react"

export interface DayPickerInputProps extends Omit<HTMLAttributes<HTMLSpanElement>, "onChange"> {
    title: string
    value: Date
    onChange?: (date: Date) => void
}

export default function DayPickerInput({
    title,
    value,
    onChange,
    className,
    ...props
}: DayPickerInputProps) {
    const [showCalendar, setShowCalendar] = useState<boolean>(false)

    return (
        <span className="flex flex-col w-full h-fit relative">
            {showCalendar && (
                <DayPicker
                    className="absolute w-fit h-fit p-5 left-0 bottom-12 gap-2 z-150"
                    defaultDate={value}
                    selected={value}
                    onSelect={(date) => {
                        onChange!(date)
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
                        <p className="max-w-full truncate">{value.toLocaleDateString("id-ID")}</p>
                        <Calendar className="size-4 shrink-0" />
                    </span>
                </span>
            </span>
        </span>
    )
}
