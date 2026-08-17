"use client"

import { cn } from "@/app/lib/global-utils"
import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { type DayPickerProps } from "@/app/props/component"
import { dateTZ } from "@/app/lib/date-timezone"
import * as DayPickerHelper from "@/app/lib/day-picker-helper"

export default function DayPicker({
    defaultDate,
    selected,
    onSelect,
    className,
    ...props
}: DayPickerProps) {
    const days = DayPickerHelper.getWeekdays()
    const [currentDate, setCurrentDate] = useState<Date>(defaultDate || dateTZ.nowDate())
    const tzDate = dateTZ.parseTZ(currentDate)
    const year = tzDate.year()
    const month = tzDate.month()
    const calendarDays = useMemo(() => DayPickerHelper.getMonthDays(year, month), [year, month])
    const handlePrevMonth = () => {
        setCurrentDate(dateTZ.parseTZ(currentDate).subtract(1, "month").startOf("month").toDate())
    }
    const handleNextMonth = () => {
        setCurrentDate(dateTZ.parseTZ(currentDate).add(1, "month").startOf("month").toDate())
    }

    return (
        <div
            className={cn(
                className,
                "flex flex-col items-start justify-start",
                "bg-indigo-50 rounded-md"
            )}
            {...props}
        >
            <div
                className={cn(
                    "w-full h-fit",
                    "flex items-center justify-center",
                    "h-10 px-1 bg-indigo-100 rounded-md",
                    "overflow-hidden"
                )}
            >
                <button
                    onClick={handlePrevMonth}
                    className={cn(
                        "size-8 cursor-pointer overflow-hidden",
                        "flex items-center justify-center",
                        "rounded-sm bg-indigo-100 hover:bg-indigo-200",
                        "transition ease-out duration-100"
                    )}
                >
                    <ChevronLeft className="size-4 shrink-0" />
                </button>
                <h6 className="text-sm flex-1 truncate text-center">
                    {currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                </h6>
                <button
                    onClick={handleNextMonth}
                    className={cn(
                        "size-8 cursor-pointer overflow-hidden",
                        "flex items-center justify-center",
                        "rounded-sm bg-indigo-100 hover:bg-indigo-200",
                        "transition ease-out duration-100"
                    )}
                >
                    <ChevronRight className="size-4 shrink-0" />
                </button>
            </div>
            <div
                className={cn(
                    "w-fit h-fit gap-1",
                    "flex flex-col items-center justify-start",
                    "overflow-hidden"
                )}
            >
                <div className={cn("w-fit h-fit gap-1", "flex items-center justify-center")}>
                    {days.map((day, index) => {
                        return (
                            <span
                                key={index}
                                className={cn(
                                    "size-8 text-sm text-center font-semibold overflow-hidden",
                                    "flex items-center justify-center"
                                )}
                            >
                                {day}
                            </span>
                        )
                    })}
                </div>
                <div className={cn("w-fit h-fit gap-1", "grid grid-cols-7")}>
                    {calendarDays.map((calendarDay, index) => {
                        const isSelected =
                            selected?.toDateString() === calendarDay.date.toDateString()

                        return (
                            <span
                                key={index}
                                className={cn(
                                    "size-8 text-sm overflow-hidden",
                                    "flex items-center justify-center"
                                )}
                            >
                                {calendarDay.isCurrentMonth ? (
                                    <button
                                        onClick={() => onSelect && onSelect(calendarDay.date)}
                                        className={cn(
                                            "text-center w-full h-full cursor-pointer",
                                            "flex items-center justify-center",
                                            "overflow-hidden rounded-full",
                                            calendarDay.isToday && "border-2 border-indigo-200",
                                            isSelected && "bg-indigo-200"
                                        )}
                                    >
                                        {calendarDay.dayNumber}
                                    </button>
                                ) : (
                                    <p className="text-center truncate max-w-full opacity-50">
                                        {calendarDay.dayNumber}
                                    </p>
                                )}
                            </span>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
