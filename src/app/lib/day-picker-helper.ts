import { dateFormatter } from "@/app/lib/global-utils"
import { dateTZ } from "@/app/lib/date-timezone"
import { CalendarDay, CalendarDayProps } from "@/app/props/component"

export function getWeekdays() {
    const baseDate = dateTZ.parseTZ("2024-01-07")
    const days = Array.from({ length: 7 }, (_, index) => {
        const date = baseDate.add(index, "day").toDate()
        return dateFormatter.shortWeekdayFormat.format(date)
    })
    return days
}

export function getMonthDays(year: number, month: number) {
    const today = dateTZ.now()
    const currentMonth = dateTZ.now().year(year).month(month).date(1).startOf("day")
    const totalDaysInMonth = currentMonth.daysInMonth()
    const firstDayIndex = currentMonth.day()
    const prevMonth = currentMonth.subtract(1, "month")
    const prevMonthTotalDays = prevMonth.daysInMonth()
    const days: CalendarDayProps[] = []

    for (let index = firstDayIndex - 1; index >= 0; index--) {
        const dayNumber = prevMonthTotalDays - index
        const date = prevMonth.date(dayNumber).toDate()

        days.push(
            CalendarDay.parse({
                date,
                dayNumber,
                isCurrentMonth: false,
                isToday: false,
            })
        )
    }
    for (let day = 1; day <= totalDaysInMonth; day++) {
        const currentDate = currentMonth.date(day)
        const isToday = currentDate.isSame(today, "day")

        days.push(
            CalendarDay.parse({
                date: currentDate.toDate(),
                dayNumber: day,
                isCurrentMonth: true,
                isToday,
            })
        )
    }
    const totalGridCells = days.length > 35 ? 42 : 35
    const remainingCells = totalGridCells - days.length
    const nextMonth = currentMonth.add(1, "month")

    for (let index = 1; index <= remainingCells; index++) {
        days.push(
            CalendarDay.parse({
                date: nextMonth.date(index).toDate(),
                dayNumber: index,
                isCurrentMonth: false,
                isToday: false,
            })
        )
    }
    return days
}
