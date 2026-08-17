import { EmployeeProps } from "@/app/props/db"

export function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array]

    for (let firstIndex = arr.length - 1; firstIndex > 0; firstIndex--) {
        const secondIndex = Math.floor(Math.random() * (firstIndex + 1))
        ;[arr[firstIndex], arr[secondIndex]] = [arr[secondIndex], arr[firstIndex]]
    }
    return arr
}

export function isFemale(employee: EmployeeProps): boolean {
    if (typeof employee.gender === "string") {
        const genderLower = employee.gender.toLowerCase()
        return genderLower === "perempuan" || genderLower === "p"
    }
    return employee.genderId === 2
}

export function isEligible(
    mapA: Map<string, number>,
    mapB: Map<string, number>,
    employeeIdA: string,
    employeeIdB: string
) {
    const monthA = mapA.get(employeeIdA) || 0
    const monthB = mapA.get(employeeIdB) || 0
    if (monthA !== monthB) return monthA - monthB

    const historyA = mapB.get(employeeIdA) || 0
    const historyB = mapB.get(employeeIdB) || 0
    return historyA - historyB
}
