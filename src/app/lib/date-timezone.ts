import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import isBetween from "dayjs/plugin/isBetween"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)

export const DEFAULT_TIMEZONE = "Asia/Jakarta"

const now = () => {
    return dayjs().tz(DEFAULT_TIMEZONE)
}

const nowDate = () => {
    return now().toDate()
}

const parseTZ = (date?: string | Date | number) => {
    return dayjs(date).tz(DEFAULT_TIMEZONE)
}

const getTZDate = (date?: string | Date | number): Date => {
    return parseTZ(date).toDate()
}

export const dateTZ = {
    now,
    nowDate,
    parseTZ,
    getTZDate,
}

export { dayjs }
