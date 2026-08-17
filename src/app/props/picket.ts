import * as z from "zod"
import { HTMLAttributes, ReactNode } from "react"
import {
    type PicketProps,
    type EmployeeBasicProps,
    type EmployeePicketProps,
    type EmployeePicketDataProps,
} from "@/app/props/db"
import variables from "@/app/data/variables.json"

export interface PicketBoxProps extends HTMLAttributes<HTMLSpanElement> {
    name: string
    employeeId: string
    category: string
    onRemind?: () => void
}

export type EmployeeClass = "I" | "II" | "III" | "IV"
export type EmployeeRoomID = "a" | "b" | "c" | "d"

export type EmployeeCategory =
    | "II/a"
    | "II/b"
    | "II/c"
    | "II/d"
    | "III/a"
    | "III/b"
    | "III/c"
    | "III/d"

export type EmployeeGender = "L" | "P"

export const EmployeeBasicData = z.object({
    category: z.enum(variables.category).nullable().default(null),
    rank: z.string().default(""),
    phone: z.string().default(""),
})

export type EmployeeBasicDataProps = z.infer<typeof EmployeeBasicData>

export const EmployeeData = z.object({
    ...EmployeeBasicData.shape,
    name: z.string().default(""),
    position: z.string().default(""),
    employeeId: z.string().default(""),
    gender: z.enum(Object.keys(variables.gendermap)).nullable().default(null),
})

export type EmployeeDataProps = z.infer<typeof EmployeeData>

export interface EmployeeFormPopupProps extends HTMLAttributes<HTMLDivElement> {
    title: string
    body?: ReactNode
    footer?: ReactNode
}

export interface EmployeeAddPopupProps extends HTMLAttributes<HTMLDivElement> {
    onCencel?: (data: EmployeeDataProps) => void
    onAddEmployee?: (data: EmployeeDataProps) => void
}

export interface EmployeeEditPopupProps extends HTMLAttributes<HTMLDivElement> {
    data: EmployeeDataProps
    onCencel?: (data: EmployeeDataProps) => void
    onSave?: (data: EmployeeDataProps) => void
}

export interface EmployeeListProps extends HTMLAttributes<HTMLDivElement> {
    employees: EmployeeBasicProps[] | null
    onAddNewEmployee?: () => void
    onDeleteEmployee?: (data: EmployeeBasicProps) => void
    onEditEmployee?: (data: EmployeeBasicProps) => void
}

export interface PicketListProps extends HTMLAttributes<HTMLDivElement> {
    pickets: PicketProps | null
    onSwapEmployee?: (data: EmployeePicketProps) => void
    onGeneratePicket?: () => void
    onPrintSheet?: () => void
    onSaveSheet?: () => void
}

export interface TodayPicketProps extends HTMLAttributes<HTMLDivElement> {
    data?: EmployeePicketProps | null
    onSend?: (data: EmployeePicketDataProps, date: Date) => void
}

export interface PicketSwapPopupProps extends HTMLAttributes<HTMLDivElement> {
    employees: EmployeeBasicProps[] | null
    data: EmployeePicketProps
    onCencel?: (data: EmployeePicketProps) => void
    onSave?: (data: EmployeePicketProps) => void
}
