import { dateFormatter } from "@/app/lib/global-utils"
import variables from "@/app/data/variables.json"
import {
    type DataBaseProps,
    type EmployeePicketProps,
    type EmployeeProps,
    EmployeePicket,
    Supervisor,
    Picket,
} from "@/app/props/db"
import { EmployeeGender } from "@/app/props/picket"
import { dateTZ } from "@/app/lib/date-timezone"
import { isFemale, shuffleArray, isEligible } from "@/app/lib/picket-helper"

export function generatePicketSchedule(data: DataBaseProps, force: boolean = false) {
    const nextMonth = dateTZ.now().add(1, "month")
    const daysInMonth = nextMonth.daysInMonth()
    const startAt = nextMonth.startOf("month").toDate()
    const endAt = nextMonth.endOf("month").toDate()
    const existingBatchIndex = data.pickets.findIndex((batch) =>
        dateTZ.parseTZ(batch.startAt).isSame(startAt, "day")
    )
    const isAlreadyExist = existingBatchIndex !== -1
    if (!force && isAlreadyExist) return { existingBatchIndex, newPicket: null }
    const previousPicketBatches = isAlreadyExist
        ? data.pickets.filter((_, idx) => idx !== existingBatchIndex)
        : data.pickets
    const picketHistoryCount = new Map<string, number>()
    data.employees.forEach((employee) => picketHistoryCount.set(employee.employeeId, 0))
    previousPicketBatches.forEach((picketBatch) => {
        picketBatch.pickets.forEach((item) => {
            const firstId = item.employees.first.employeeId
            const secondId = item.employees.second.employeeId

            if (firstId) picketHistoryCount.set(firstId, (picketHistoryCount.get(firstId) || 0) + 1)
            if (secondId)
                picketHistoryCount.set(secondId, (picketHistoryCount.get(secondId) || 0) + 1)
        })
    })
    const monthPicketCount = new Map<string, number>()
    data.employees.forEach((employee) => monthPicketCount.set(employee.employeeId, 0))
    const class3Employees = data.employees.filter((employee) => employee.classId === 3)
    const class2Employees = data.employees.filter((employee) => employee.classId === 2)
    const dailyPickets: EmployeePicketProps[] = []
    const supervisors = variables.supervisor
    const totalPastDays = previousPicketBatches.reduce(
        (acc, batch) => acc + batch.pickets.length,
        0
    )
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = nextMonth.date(day).startOf("day").toDate()
        const globalDayIndex = totalPastDays + day - 1
        const supervisorIndex = Math.floor(globalDayIndex / 5) % supervisors.length
        const currentSupervisor = supervisors[supervisorIndex]
        const eligibleClass3 = shuffleArray([...class3Employees]).sort((a, b) =>
            isEligible(monthPicketCount, picketHistoryCount, a.employeeId, b.employeeId)
        )
        const eligibleClass2 = shuffleArray([...class2Employees]).sort((a, b) =>
            isEligible(monthPicketCount, picketHistoryCount, a.employeeId, b.employeeId)
        )
        let selectedFirst: EmployeeProps | null = null
        let selectedSecond: EmployeeProps | null = null

        for (const employee3 of eligibleClass3) {
            for (const employee2 of eligibleClass2) {
                if (!(isFemale(employee3) && isFemale(employee2))) {
                    selectedFirst = employee3
                    selectedSecond = employee2
                    break
                }
            }
            if (selectedFirst && selectedSecond) break
        }
        if (selectedFirst && selectedSecond) {
            const firstCount = (picketHistoryCount.get(selectedFirst.employeeId) || 0) + 1
            const secondCount = (picketHistoryCount.get(selectedSecond.employeeId) || 0) + 1

            picketHistoryCount.set(selectedFirst.employeeId, firstCount)
            picketHistoryCount.set(selectedSecond.employeeId, secondCount)
            monthPicketCount.set(
                selectedFirst.employeeId,
                (monthPicketCount.get(selectedFirst.employeeId) || 0) + 1
            )
            monthPicketCount.set(
                selectedSecond.employeeId,
                (monthPicketCount.get(selectedSecond.employeeId) || 0) + 1
            )
            const newPicketSchedule = EmployeePicket.parse({
                id: crypto.randomUUID(),
                employees: {
                    first: {
                        employeeId: selectedFirst.employeeId,
                        name: selectedFirst.name,
                        gender: variables.gender[
                            variables.gendermap[(selectedFirst.gender as EmployeeGender) || "L"]
                        ],
                        category: `${selectedFirst.class}/${selectedFirst.room}`,
                        phone: selectedFirst.phone,
                    },
                    second: {
                        employeeId: selectedSecond.employeeId,
                        name: selectedSecond.name,
                        gender: variables.gender[
                            variables.gendermap[(selectedSecond.gender as EmployeeGender) || "L"]
                        ],
                        category: `${selectedSecond.class}/${selectedSecond.room}`,
                        phone: selectedSecond.phone,
                    },
                },
                supervisor: currentSupervisor as Supervisor,
                schedule: currentDate,
            })
            dailyPickets.push(newPicketSchedule)
        }
    }
    return {
        existingBatchIndex,
        newPicket: Picket.parse({
            id: crypto.randomUUID(),
            pickets: dailyPickets,
            startAt,
            endAt,
        }),
    }
}

export async function sendDirectWAMessage(name: string, phone: string, date: Date) {
    const formattedDate = dateFormatter.longFullFormat.format(date)
    const message =
        `Halo *${name}*, Anda dijadwalkan untuk melaksanakan piket besok pada tanggal *${formattedDate}*. ` +
        "Mohon untuk hadir tepat waktu dan melaksanakan tugas dengan baik ya!"

    const res = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
            Authorization: process.env.WA_API_TOKEN || "",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            target: phone,
            message,
        }),
    })
    const data = await res.json()

    return data
}
