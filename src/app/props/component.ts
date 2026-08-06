import { FileText, ClipboardClock } from "lucide-react"
import { HTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react"
import * as z from "zod"

export interface CheckBoxProps extends HTMLAttributes<HTMLSpanElement> {
    active: boolean
    title?: string
}

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    title: string
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    title: string
}

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
    onChoose?: (value: string) => void
    title: string
    placeholder: string
    options: string[]
    value?: string | null
}

export const ComponentRegistry = {
    FileText,
    ClipboardClock,
}

export interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {
    names: string[]
}

export type Division = "Intel" | "Pembinaan" | "Pidum" | "Pidsus" | "PAPBB" | "Datun"

export interface DocumentInitProps {
    name: string
    division: Division | null
}

export const DocumentInit = z.object({
    name: z.string().default(""),
    division: z
        .enum(["Intel", "Pembinaan", "Pidum", "Pidsus", "PAPBB", "Datun"])
        .nullable()
        .default(null),
})

export type NotificationType = "error" | "warning" | "notification"

export interface NotificationProps extends HTMLAttributes<HTMLSpanElement> {
    title: string
    description: string
    type: NotificationType
    onClose?: () => void
}

export interface PopupStateProps {
    show: boolean
    title: string
    description: string
    type: NotificationType
}

export const PopupState = z.object({
    show: z.boolean().default(false),
    title: z.string().default(""),
    description: z.string().default(""),
    type: z.enum(["error", "warning", "notification"]).default("notification"),
})

export type InfoPopupProps = HTMLAttributes<HTMLDivElement> & InfoPopupDataProps

export const InfoPopupDataSchema = {
    title: z.string().default(""),
    description: z.string().default(""),
    dismissTitle: z.string().optional(),
    acceptTitle: z.string().optional(),
    onDismiss: z.function().optional(),
    onAccept: z.function().optional(),
    onClose: z.function().optional(),
}

export const InfoPopupData = z.object(InfoPopupDataSchema)

export const InfoPopupState = z.object({
    ...InfoPopupDataSchema,
    active: z.boolean().default(false),
})

export type InfoPopupDataProps = z.infer<typeof InfoPopupData>
export type InfoPopupStateProps = z.infer<typeof InfoPopupState>

export type WeekdayFormat = "narrow" | "short" | "long"

export interface CalendarDayProps {
    date: Date
    dayNumber: number
    isCurrentMonth: boolean
    isToday: boolean
}

export const CalendarDay = z.object({
    date: z.date().default(new Date()),
    dayNumber: z.number().default(1),
    isCurrentMonth: z.boolean().default(false),
    isToday: z.boolean().default(false),
})

export interface DayPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
    defaultDate?: Date
    selected: Date
    onSelect?: (date: Date) => void
}
