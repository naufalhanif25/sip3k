import * as z from "zod"
import path from "path"
import { HTMLAttributes, ChangeEvent } from "react"
import { type TemplateGetResponseProps } from "@/app/props/api"
import { type ExcelCellProps } from "@/app/props/api"
import variables from "@/app/data/variables.json"
import { type SPTJBProps } from "@/app/props/db"
import { dateTZ } from "@/app/lib/date-timezone"

export type Division = "Intel" | "Pembinaan" | "Pidum" | "Pidsus" | "PAPBB" | "Datun"
export const DivisionSchema = z.enum(variables.divisions).nullable().default(null)

export const DocumentInit = z.object({
    id: z.string().nullable().default(null),
    docId: z.string().nullable().default(null),
    name: z.string().default(""),
    division: DivisionSchema,
    _class: z.string().default(""),
})

export type DocumentInitProps = z.infer<typeof DocumentInit>

export interface FormSideProps extends HTMLAttributes<HTMLDivElement> {
    data: DocumentInitProps
    formData: FormInputProps[]
    formDataKey: number
    onNameChange?: (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
    onChoose?: (value: string) => void
    onClassChoose?: (value: string) => void
    onFormPrev?: () => void
    onFormNewNext?: () => void
    isLast: boolean
    onFormDelete?: (index: number) => void
    onFormCodeChange?: (
        event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
        index: number
    ) => void
    onFormNameChange?: (
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement,
            HTMLInputElement | HTMLTextAreaElement
        >,
        index: number
    ) => void
    onFormDescChange?: (
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement,
            HTMLInputElement | HTMLTextAreaElement
        >,
        index: number
    ) => void
    onFormDateChange?: (date: Date, index: number) => void
    onFormIDChange?: (event: ChangeEvent<HTMLInputElement, HTMLInputElement>, index: number) => void
    onFormTotalChange?: (
        event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
        index: number
    ) => void
    onFormPPNChange?: (
        event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
        index: number
    ) => void
    onFormPPhChange?: (
        event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
        index: number
    ) => void
}

export const SPTJBBasicMetadata = z.record(z.string(), z.string().or(z.number()).or(z.null()))
export type SPTJBBasicMetadataProps = z.infer<typeof SPTJBBasicMetadata>

export interface SPTJBPreviewProps extends HTMLAttributes<HTMLDivElement> {
    data: DocumentInitProps
    formData: FormInputProps[]
    metadata: SPTJBBasicMetadataProps
    template: TemplateGetResponseProps | null
}

export interface MainSPTJBProps extends HTMLAttributes<HTMLDivElement> {
    onCreate?: () => void
    onDivisionChoose?: (value: string) => void
    onClassChoose?: (value: string) => void
    onNameChange?: (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
    onItemOpen?: (id: string) => void
    onItemDelete?: (afterDelete?: () => void, id?: string) => void
    onItemView?: (id: string) => void
    errorFallback: (title: string, message: string) => void
    data: DocumentInitProps
}

export interface NewSPTJBProps extends HTMLAttributes<HTMLDivElement> {
    onBack?: (isChanged: boolean, data: FormInputProps[]) => void
    onDelete?: () => void
    onSave?: (data: FormInputProps[], callback?: (id: string) => void) => void
    onPrint?: () => void
    onChoose?: (value: string) => void
    onClassChoose?: (value: string) => void
    onNameChange?: (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
    setDocId?: (value: string) => void
    errorFallback: (title: string, message: string) => void
    parentForm: FormInputProps[] | null
    data: DocumentInitProps
}

export interface FormSectionProps extends HTMLAttributes<HTMLDivElement> {
    title: string
}

export const FormInput = z.object({
    code: z.number().default(0),
    name: z.string().default(""),
    description: z.string().default(""),
    date: z.coerce.date().default(() => dateTZ.nowDate()),
    id: z.number().default(0),
    total: z.number().default(0),
    ppn: z.number().default(0),
    pph: z.number().default(0),
})

export type FormInputProps = z.infer<typeof FormInput>

export interface AdditionalFormProps extends HTMLAttributes<HTMLSpanElement> {
    onDelete?: () => void
    onCodeChange?: (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
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
    onIDChange?: (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
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

export const ParsedHeaderFooter = z.object({
    left: z.string().default(""),
    center: z.string().default(""),
    right: z.string().default(""),
})

export type ParsedHeaderFooterProps = z.infer<typeof ParsedHeaderFooter>

export interface FooterDisplayProps extends HTMLAttributes<HTMLDivElement> {
    metadata: SPTJBMetadataProps
    text: string
}

export const ParsedMerge = z.custom<ParsedMergeProps>()

export const ProcessedTableResult = z.object({
    rows: z.array(z.array(z.custom<ExcelCellProps>()).default([])).default([]),
    merges: ParsedMerge,
})

export type ProcessedTableResultProps = z.infer<typeof ProcessedTableResult>

export type SPTJBMetadataProps = Record<string, string | number | Date | null | undefined>

export const SPTJBMetadata = z.record(
    z.string(),
    z.string().or(z.number()).or(z.coerce.date()).or(z.null()).or(z.undefined())
)

export interface DocumentListProps extends HTMLAttributes<HTMLDivElement> {
    onOpenTrigger?: (id: string) => void
    onDeleteTrigger?: (id: string) => void
    onViewTrigger?: (id: string) => void
    data: SPTJBProps[] | null
}

export const PaperCanvasRenderData = z.object({
    renderData: z.custom<TemplateGetResponseProps>(),
    merges: ParsedMerge,
    pageNumber: z.number().default(0),
})

export type PaperCanvasRenderDataProps = z.infer<typeof PaperCanvasRenderData>

export interface PaperCanvasProps extends HTMLAttributes<HTMLSpanElement> {
    template: TemplateGetResponseProps
    metadata: SPTJBBasicMetadataProps
    page: PaperCanvasRenderDataProps
    totalPages: number
}

export interface PreviewPopupProps extends HTMLAttributes<HTMLDivElement> {
    formData: FormInputProps[] | null
    data: DocumentInitProps
    errorFallback: (title: string, message: string) => void
    onClose?: () => void
    onOpen?: () => void
    onPrint?: () => void
}

export const TEMPLATE_PATH = path.join(process.cwd(), "public", "template.xlsx")