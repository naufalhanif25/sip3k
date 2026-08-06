"use client"

import { cn } from "../lib/cn"
import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { WeekdayFormat } from "../props/component"
import { CalendarDayProps, CalendarDay } from "../props/component"
import { DayPickerProps } from "../props/component"

export function getWeekdays(locale: string = "id-ID", format: WeekdayFormat = "short") {
    const baseDate = new Date(2024, 0, 7)
    const days = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(baseDate)
        date.setDate(baseDate.getDate() + index)

        return date.toLocaleDateString(locale, { weekday: format })
    })
    return days
}

export function getMonthDays(year: number, month: number) {
    const today = new Date()
    const firstDayOfMonth = new Date(year, month, 1)
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayIndex = firstDayOfMonth.getDay()
    const days: CalendarDayProps[] = []
    const prevMonthTotalDays = new Date(year, month, 0).getDate()

    for (let index = firstDayIndex - 1; index >= 0; index--) {
        const dayNumber = prevMonthTotalDays - index

        days.push(
            CalendarDay.parse({
                date: new Date(year, month - 1, dayNumber),
                dayNumber,
                isCurrentMonth: false,
                isToday: false,
            })
        )
    }
    for (let day = 1; day <= totalDaysInMonth; day++) {
        const date = new Date(year, month, day)
        const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()

        days.push(
            CalendarDay.parse({
                date,
                dayNumber: day,
                isCurrentMonth: true,
                isToday,
            })
        )
    }
    const totalGridCells = days.length > 35 ? 42 : 35
    const remainingCells = totalGridCells - days.length

    for (let index = 1; index <= remainingCells; index++) {
        days.push(
            CalendarDay.parse({
                date: new Date(year, month + 1, index),
                dayNumber: index,
                isCurrentMonth: false,
                isToday: false,
            })
        )
    }
    return days
}

export default function DayPicker({
    defaultDate,
    selected,
    onSelect,
    className,
    ...props
}: DayPickerProps) {
    const days = getWeekdays("id-ID", "short")
    const [currentDate, setCurrentDate] = useState<Date>(defaultDate || new Date())
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const calendarDays = useMemo(() => getMonthDays(year, month), [year, month])
    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

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
                                        onClick={() => onSelect!(calendarDay.date)}
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
