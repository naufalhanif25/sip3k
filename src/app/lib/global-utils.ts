import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { DashboardSubPage, type PageRouteProps } from "@/app/props/dashboard"
import { jwtVerify } from "jose"
import validator from "validator"
import { LOCALE } from "@/app/vars/db-vars"

export function cn(...classNames: ClassValue[]): string {
    return twMerge(clsx(classNames))
}

export const fetchData = async (
    url: string | URL | Request,
    options?: RequestInit,
    callback?: (data: unknown) => void
) => {
    try {
        const res = await fetch(url, options)
        const data = await res.json()

        if (callback) callback(data)
    } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
            return
        }
        console.error(err)
    }
}

export const generatePageInfo = (path: string, target?: PageRouteProps) => {
    return DashboardSubPage.parse({
        title: target?.name ?? path.replace(/\b\w/g, (char) => char.toUpperCase()),
        description: target?.description ?? path.replace(/\b\w/g, (char) => char.toUpperCase()),
    })
}

export const fuzzyMatch = (text: string, query: string) => {
    const cleanQuery = query.toLowerCase().trim()
    if (!cleanQuery) return true
    const cleanText = text.toLowerCase()
    let queryIndex = 0

    for (let index = 0; index < cleanText.length && queryIndex < cleanQuery.length; index++) {
        if (cleanText[index] === cleanQuery[queryIndex]) queryIndex++
    }
    return queryIndex === cleanQuery.length
}

export const matchDate = {
    isEquals: (first: Date, second: Date) => {
        return (
            first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate()
        )
    },
    isInRange: (lower: Date, upper: Date, target: Date) => {
        return (
            target.getDate() >= lower.getDate() &&
            target.getMonth() >= lower.getMonth() &&
            target.getFullYear() >= lower.getFullYear() &&
            target.getDate() <= upper.getDate() &&
            target.getMonth() <= upper.getMonth() &&
            target.getFullYear() <= upper.getFullYear()
        )
    },
}

export const dateFormatter = {
    longFullFormat: new Intl.DateTimeFormat(LOCALE, {
        day: "numeric",
        month: "long",
        year: "numeric",
    }),
    shortFullFormat: new Intl.DateTimeFormat(LOCALE, {
        day: "numeric",
        month: "short",
        year: "numeric",
    }),
    longFormat: new Intl.DateTimeFormat(LOCALE, {
        month: "long",
        year: "numeric",
    }),
    shortFormat: new Intl.DateTimeFormat(LOCALE, {
        month: "short",
        year: "numeric",
    }),
    longWeekdayFormat: new Intl.DateTimeFormat(LOCALE, {
        weekday: "long",
    }),
    shortWeekdayFormat: new Intl.DateTimeFormat(LOCALE, {
        weekday: "short",
    }),
    defultFormat: new Intl.DateTimeFormat(LOCALE),
}

export const valueValidator = {
    isValidText: (value: string) => validator.isAlpha(value.trim(), "en-US", { ignore: " .,\t" }),
    isValidID: (value: string) => validator.isNumeric(value.trim(), { no_symbols: true }),
    isValidPhone: (value: string) => validator.isMobilePhone(value.trim(), LOCALE),
    isValidNumber: (value: string) => {
        if (!validator.isNumeric(value)) return false
        const sanitizedValue = value.replace(/^0+/, "")
        if (!sanitizedValue) return false
        return true
    },
}

export const verifyJWT = async (token: string) => {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
        const { payload } = await jwtVerify(token, secret)

        return payload
    } catch {
        return null
    }
}

export const formatConfig = (text: string, config: Record<string, string>) => {
    let result = text
    Object.entries(config).forEach(([key, value]) => {
        result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value)
    })
    return result
}
