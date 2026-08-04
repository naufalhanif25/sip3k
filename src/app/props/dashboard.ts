import * as z from "zod"
import { ChangeEvent, HTMLAttributes, ReactNode } from "react"
import { DocumentInitProps } from "./component"

export type DashboardProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode
}

export interface DashboardSidebarButtonProps extends HTMLAttributes<HTMLSpanElement> {
    title: string
    color: string
    icon: ReactNode
}

export interface PreviewBoxProps extends HTMLAttributes<HTMLSpanElement> {
    data: {
        name: string
        icon: string
        color: string
    }[]
    title: string
    description: string
}

export interface DashboardSubPageProps {
    title: string
    description: string
}

export const DashboardSubPage = z.object({
    title: z.string(),
    description: z.string(),
})

export interface RoundButtonProps extends HTMLAttributes<HTMLSpanElement> {
    icon: ReactNode
}

export interface PicketBoxProps extends HTMLAttributes<HTMLSpanElement> {
    name: string
    nip: string
    lastRemind?: string | null
    onDone?: () => void
    onRemind?: () => void
}

export interface MainSPTJBProps extends HTMLAttributes<HTMLDivElement> {
    onCreate?: () => void
    onChoose?: (value: string) => void
    onNameChange?: (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
    data: DocumentInitProps
}

export interface NewSPTJBProps extends HTMLAttributes<HTMLDivElement> {
    onBack?: () => void
    onDelete?: () => void
    onSave?: () => void
    onPrint?: () => void
    onChoose?: (value: string) => void
    onNameChange?: (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
    data: DocumentInitProps
}

export interface FormSectionProps extends HTMLAttributes<HTMLDivElement> {
    title: string
}

export interface FormInputProps {
    code: string
    name: string
    description: string
    date: Date
    total: number
}

export const FormInput = z.object({
    code: z.string(),
    name: z.string(),
    description: z.string(),
    date: z.date(),
    total: z.number(),
})

export interface AdditionalFormProps extends HTMLAttributes<HTMLSpanElement> {
    onChoose?: (value: string) => void
    onNameChange?: (
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement,
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => void
    onDescChange?: (
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement,
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => void
    onDateChange?: (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
    onTotalChange?: (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
    title: string
    data: FormInputProps
}
