import { ChangeEvent } from "react"
import { Dispatch, SetStateAction } from "react"
import { type DocumentInitProps, type FormInputProps } from "@/app/props/sptjb"
import { dateTZ } from "@/app/lib/date-timezone"
import * as UtilsHandler from "@/app/lib/utils-handler"

export const codeChangeHandler = (
    setter: Dispatch<SetStateAction<FormInputProps[]>>,
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
    index: number
) => {
    UtilsHandler.nullableNumberChangeHandler(event, index, (value) => {
        setter((prev) =>
            prev.map((item, idx) =>
                idx === index ? { ...item, code: value === "" ? 0 : Number(value) } : item
            )
        )
    })
}

export const nameChangeHandler = (
    setter: Dispatch<SetStateAction<FormInputProps[]>>,
    event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement,
        HTMLInputElement | HTMLTextAreaElement
    >,
    index: number
) => {
    setter((prev) =>
        prev.map((item, idx) => (idx === index ? { ...item, name: event.target.value } : item))
    )
}

export const descChangeHandler = (
    setter: Dispatch<SetStateAction<FormInputProps[]>>,
    event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement,
        HTMLInputElement | HTMLTextAreaElement
    >,
    index: number
) => {
    setter((prev) =>
        prev.map((item, idx) =>
            idx === index ? { ...item, description: event.target.value } : item
        )
    )
}

export const dateChangeHandler = (
    setter: Dispatch<SetStateAction<FormInputProps[]>>,
    date: Date,
    index: number
) => {
    setter((prev) => prev.map((item, idx) => (idx === index ? { ...item, date } : item)))
}

export const idChangeHandler = (
    setter: Dispatch<SetStateAction<FormInputProps[]>>,
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
    index: number
) => {
    UtilsHandler.nullableNumberChangeHandler(event, index, (value) => {
        setter((prev) =>
            prev.map((item, idx) =>
                idx === index ? { ...item, id: value === "" ? 0 : Number(value) } : item
            )
        )
    })
}

export const totalChangeHandler = (
    setter: Dispatch<SetStateAction<FormInputProps[]>>,
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
    index: number
) => {
    UtilsHandler.nullableNumberChangeHandler(event, index, (value, index) =>
        setter((prev) =>
            prev.map((item, idx) =>
                idx === index ? { ...item, total: value === "" ? 0 : Number(value) } : item
            )
        )
    )
}

export const PPNChangeHandler = (
    setter: Dispatch<SetStateAction<FormInputProps[]>>,
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
    index: number
) => {
    UtilsHandler.nullableNumberChangeHandler(event, index, (value, index) =>
        setter((prev) =>
            prev.map((item, idx) =>
                idx === index ? { ...item, ppn: value === "" ? 0 : Number(value) } : item
            )
        )
    )
}

export const PPhChangeHandler = (
    setter: Dispatch<SetStateAction<FormInputProps[]>>,
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
    index: number
) => {
    UtilsHandler.nullableNumberChangeHandler(event, index, (value, index) =>
        setter((prev) =>
            prev.map((item, idx) =>
                idx === index ? { ...item, pph: value === "" ? 0 : Number(value) } : item
            )
        )
    )
}

export const addNewFormHandler = (
    formSetter: Dispatch<SetStateAction<FormInputProps[]>>,
    indexSetter: Dispatch<SetStateAction<number>>,
    initData: FormInputProps,
    dataLength: number
) => {
    formSetter((prev) => [...prev, initData])
    indexSetter(dataLength)
}

export const formPrevHandler = (setter: Dispatch<SetStateAction<number>>) => {
    setter((prev) => {
        const prevIndex = prev - 1
        return prevIndex <= 0 ? 0 : prevIndex
    })
}

export function formNextHandler(setter: Dispatch<SetStateAction<number>>, lastIndex: number) {
    setter((prev) => {
        const prevIndex = prev + 1
        return prevIndex >= lastIndex ? lastIndex : prevIndex
    })
}

export function deleteFormHandler(
    formSetter: Dispatch<SetStateAction<FormInputProps[]>>,
    indexSetter: Dispatch<SetStateAction<number>>,
    initData: FormInputProps,
    index: number,
    lastIndex: number
) {
    formSetter((prev) => {
        const filteredData = prev.filter((_, idx) => idx !== index)

        if (filteredData.length === 0) {
            return [initData]
        }
        return filteredData
    })
    indexSetter((prev) => {
        const currentLastIndex = lastIndex - 1

        if (prev > currentLastIndex && prev > 0) {
            return prev - 1
        }
        return prev
    })
}

export const validateDocumentInput = (data: DocumentInitProps, callback?: () => void) => {
    if (!data.name || data.division === null) {
        if (callback) callback()
        return false
    }
    return true
}

export function generateDocId(index: number, code?: string) {
    const currentDate = dateTZ.nowDate()
    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()
    const letterIndex = String(index).padStart(4, "0")

    if (!code) return null
    return `B-${letterIndex}/${code}/SPTJB/${month}/${year}`
}

export const getDocumentCode = (value: string) => {
    const regex = /\{\{\s*code:\s*([^}\s]+)\s*\}\}/
    const match = value.match(regex)

    if (match) {
        const result = match[1]
        return { isTrue: true, value: result, prefix: value.replace(regex, "") }
    }
    return { isTrue: false, value, prefix: null }
}

export const currencyFormatter = new Intl.NumberFormat("id-ID")
