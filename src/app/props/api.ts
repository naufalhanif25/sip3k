import { ValueType } from "exceljs"
import { Employee, EmployeePicket, Picket, SPTJB, SPTJBDetail } from "@/app/props/db"
import { v4 as uuidv4 } from "uuid"
import * as z from "zod"

export const ExcelCell = z.object({
    value: z
        .string()
        .or(z.number())
        .or(z.coerce.date())
        .or(z.record(z.string(), z.unknown()))
        .default(""),
    type: z.custom<ValueType>().default(ValueType.String),
    alignment: z.record(z.string(), z.unknown()).default({}),
    font: z.record(z.string(), z.unknown()).default({}),
    fill: z.record(z.string(), z.unknown()).default({}),
    border: z.record(z.string(), z.unknown()).default({}),
})

export type ExcelCellProps = z.infer<typeof ExcelCell>

export const ExcelFontStyle = z.object({
    name: z.string().default(""),
    size: z.number().default(0),
    family: z.number().default(0),
})

export type ExcelFontStyleProps = z.infer<typeof ExcelFontStyle>

export const ExcelHeaderFooter = z.object({
    font: ExcelFontStyle,
    differentFirst: z.boolean().default(false),
    differentOddEven: z.boolean().default(false),
    oddHeader: z.string().default(""),
    oddFooter: z.string().default(""),
    evenHeader: z.string().default(""),
    evenFooter: z.string().default(""),
    firstHeader: z.string().default(""),
    firstFooter: z.string().default(""),
})

export type ExcelHeaderFooterProps = z.infer<typeof ExcelHeaderFooter>

export const TemplateData = z.object({
    length: z.number().default(0),
    code: z.string().default(""),
    merges: z.array(z.string()).default([]),
    rows: z.array(z.array(ExcelCell)).default([]),
    columns: z
        .array(
            z.object({
                width: z.number(),
            })
        )
        .default([]),
    headerFooter: ExcelHeaderFooter,
})

export type TemplateDataProps = z.infer<typeof TemplateData>

export const BasicAPIResponse = z.object({
    success: z.boolean().default(true),
    message: z.string().default(""),
})

export type BasicAPIResponseProps = z.infer<typeof BasicAPIResponse>

export const TemplateGetResponse = z.object({
    ...BasicAPIResponse.shape,
    data: TemplateData,
})

export type TemplateGetResponseProps = z.infer<typeof TemplateGetResponse>

export const UserData = z.object({
    username: z.string().default(""),
})

export type UserDataProps = z.infer<typeof UserData>

export const UserLoginAPIResponse = z.object({
    ...BasicAPIResponse.shape,
    data: UserData.optional(),
})

export type UserLoginAPIResponseProps = z.infer<typeof UserLoginAPIResponse>

export const EmployeeGetResponse = z.object({
    ...BasicAPIResponse.shape,
    data: z.array(Employee).default([]),
})

export type EmployeeGetResponseProps = z.infer<typeof EmployeeGetResponse>

export const DocumentGetResponse = z.object({
    ...BasicAPIResponse.shape,
    data: z.array(SPTJB).default([]),
})

export type DocumentGetResponseProps = z.infer<typeof DocumentGetResponse>

export const DocumentGetOneResponse = z.object({
    ...BasicAPIResponse.shape,
    data: SPTJBDetail,
})

export type DocumentGetOneResponseProps = z.infer<typeof DocumentGetOneResponse>

export const DocumentPostResponse = z.object({
    ...BasicAPIResponse.shape,
    data: z.object({
        id: z.string().default(uuidv4()),
    }),
})

export type DocumentPostResponseProps = z.infer<typeof DocumentPostResponse>

export const PicketGetResponse = z.object({
    ...BasicAPIResponse.shape,
    data: Picket.nullable().optional(),
})

export type PicketGetResponseProps = z.infer<typeof PicketGetResponse>

export const TodatPicketGetResponse = z.object({
    ...BasicAPIResponse.shape,
    data: EmployeePicket.nullable().optional(),
})

export type TodatPicketGetResponseProps = z.infer<typeof TodatPicketGetResponse>