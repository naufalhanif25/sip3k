import * as z from "zod"
import { ChangeEvent, HTMLAttributes, ReactNode } from "react"
import { DocumentInitProps } from "./component"
import { TemplateGetResponseProps } from "./api"

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
    category: string
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
    onBack?: (isChanged: boolean) => void
    onDelete?: (isChanged: boolean) => void
    onSave?: (isChanged: boolean) => void
    onPrint?: (isChanged: boolean) => void
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
    ppn: number
    pph: number
}

export const FormInput = z.object({
    code: z.string(),
    name: z.string(),
    description: z.string(),
    date: z.date(),
    total: z.number(),
    ppn: z.number(),
    pph: z.number(),
})

export interface AdditionalFormProps extends HTMLAttributes<HTMLSpanElement> {
    onDelete?: () => void
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
    onDateChange?: (date: Date) => void
    onTotalChange?: (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
    onPPNChange?: (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
    onPPhChange?: (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
    title: string
    data: FormInputProps
}

export interface ExcelMergeInfoProps {
    rowSpan: number
    colSpan: number
}

export interface ParsedMergeProps {
    mergeMap: Map<string, ExcelMergeInfoProps>
    hiddenCells: Set<string>
}

export interface ExcelTableProps extends HTMLAttributes<HTMLTableElement> {
    data: TemplateGetResponseProps
    merges: ParsedMergeProps
}

export type EmployeeCategory =
    | "II/a"
    | "II/b"
    | "II/c"
    | "II/d"
    | "III/a"
    | "III/b"
    | "III/c"
    | "III/d"

export interface EmployeeDataProps {
    name: string
    category: EmployeeCategory | null
    nip: string
    phone: string
}

export const EmployeeData = z.object({
    name: z.string().default(""),
    category: z
        .enum(["II/a", "II/b", "II/c", "II/d", "III/a", "III/b", "III/c", "III/d"])
        .nullable()
        .default(null),
    nip: z.string().default(""),
    phone: z.string().default(""),
})

export interface EmployeeFormPopupProps extends HTMLAttributes<HTMLDivElement> {
    onCencel?: () => void
    onAddEmployee?: () => void
}
