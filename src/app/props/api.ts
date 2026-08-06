import { ValueType } from "exceljs"
import * as z from "zod"

export const ExcelCell = z.object({
    value: z.string().or(z.number()).or(z.date()).or(z.record(z.string(), z.unknown())).default(""),
    type: z.custom<ValueType>().default(ValueType.String),
    alignment: z.record(z.string(), z.unknown()).default({}),
    font: z.record(z.string(), z.unknown()).default({}),
    fill: z.record(z.string(), z.unknown()).default({}),
    border: z.record(z.string(), z.unknown()).default({}),
})

export type ExcelCellProps = z.infer<typeof ExcelCell>

export interface TemplateDataProps {
    merges: string[]
    rows: ExcelCellProps[][]
    columns: { width: number }[]
}

export const TemplateData = z.object({
    merges: z.array(z.string()),
    rows: z.array(z.array(ExcelCell)),
    columns: z.array(
        z.object({
            width: z.number(),
        })
    ),
})

export interface TemplateGetResponseProps {
    success: boolean
    data: TemplateDataProps
}

export const TemplateGetResponse = z.object({
    success: z.boolean(),
    data: TemplateData,
})

export interface BasicAPIResponseProps {
    success: boolean,
    message: string
}

export const BasicAPIResponse = z.object({
    success: z.boolean().default(true),
    message: z.string().default("")
})