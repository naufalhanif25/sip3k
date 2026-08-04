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
    name: z.string(),
    division: z.enum(["Intel", "Pembinaan", "Pidum", "Pidsus", "PAPBB", "Datun"]).nullable(),
})
