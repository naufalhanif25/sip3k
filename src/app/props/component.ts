import { FileText, ClipboardClock } from "lucide-react"
import { HTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react"
import { dateTZ } from "@/app/lib/date-timezone"
import * as z from "zod"

export interface CheckBoxProps extends HTMLAttributes<HTMLSpanElement> {
    active: boolean
    title?: string
}

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    title?: string
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    title?: string
}

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
    onChoose?: (value: string) => void
    title: string
    placeholder: string
    active?: boolean
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

export const NOTIF_TYPE = ["error", "warning", "notification"]

export const NotificationTypeSchema = z.enum(NOTIF_TYPE)
export type NotificationType = z.infer<typeof NotificationTypeSchema>

export interface NotificationProps extends HTMLAttributes<HTMLSpanElement> {
    title: string
    description: string
    type: NotificationType
    onClose?: () => void
}

export interface NotificationStateProps {
    show: boolean
    title: string
    description: string
    type: NotificationType
}

export const NotificationState = z.object({
    show: z.boolean().default(false),
    title: z.string().default(""),
    description: z.string().default(""),
    type: NotificationTypeSchema.default(NOTIF_TYPE[0]),
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

export const CalendarDay = z.object({
    date: z.coerce.date().default(() => dateTZ.nowDate()),
    dayNumber: z.number().default(1),
    isCurrentMonth: z.boolean().default(false),
    isToday: z.boolean().default(false),
})

export type CalendarDayProps = z.infer<typeof CalendarDay>

export interface DayPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
    defaultDate?: Date
    selected: Date
    onSelect?: (date: Date) => void
}

export interface DayPickerInputProps extends Omit<HTMLAttributes<HTMLSpanElement>, "onChange"> {
    title: string
    value: Date
    onChange?: (date: Date) => void
}

export interface SearchBarProps extends HTMLAttributes<HTMLSpanElement> {
    onSearch?: (value: string) => void
}

export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
    currentPage: number
    totalPages: number
    onPrevPage?: () => void
    onNextPage?: () => void
}

export interface TableTopHeaderProps extends HTMLAttributes<HTMLDivElement>, PaginationProps {
    title: string
    onSearch?: (value: string) => void
    onPageSizeChange?: (value?: number) => void
}
