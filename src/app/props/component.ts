import { FileText, ClipboardClock, FileStack, SquarePen, Trash, ZoomIn, Save } from "lucide-react"
import { HTMLAttributes, InputHTMLAttributes } from "react"
import { ReactNode } from "react"

export interface HomeCheckBoxProps extends HTMLAttributes<HTMLSpanElement> {
    active: boolean
    title: string
}

export interface HomeInputProps extends InputHTMLAttributes<HTMLInputElement> {
    title: string
}

export type DropdownProps = HTMLAttributes<HTMLSpanElement>

export interface DropdownButtonProps extends HTMLAttributes<HTMLButtonElement> {
    title: string
    icon: ReactNode
}

export const ComponentRegistry = {
    FileText,
    ClipboardClock,
    FileStack,
    SquarePen,
    Trash,
    ZoomIn,
    Save
}
