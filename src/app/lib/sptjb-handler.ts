import { ChangeEvent } from "react"
import { Dispatch, SetStateAction } from "react"
import { FormInputProps } from "../props/dashboard"
import { ExcelMergeInfoProps, ParsedMergeProps } from "../props/dashboard"

export const codeChangeHandler = (
    setter: Dispatch<SetStateAction<FormInputProps[]>>,
    value: string,
    index: number
) => setter((prev) => prev.map((item, idx) => (idx === index ? { ...item, code: value } : item)))

export const nameChangeHandler = (
    setter: Dispatch<SetStateAction<FormInputProps[]>>,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, HTMLInputElement | HTMLTextAreaElement>,
    index: number
) =>
    setter((prev) =>
        prev.map((item, idx) => (idx === index ? { ...item, name: e.target.value } : item))
    )

export const descChangeHandler = (
    setter: Dispatch<SetStateAction<FormInputProps[]>>,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, HTMLInputElement | HTMLTextAreaElement>,
    index: number
) =>
    setter((prev) =>
        prev.map((item, idx) => (idx === index ? { ...item, description: e.target.value } : item))
    )

export const dateChangeHandler = (
    setter: Dispatch<SetStateAction<FormInputProps[]>>,
    date: Date,
    index: number
) => setter((prev) => prev.map((item, idx) => (idx === index ? { ...item, date } : item)))

export const currencyChangeHandler = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
    index: number,
    callback: (value: string, index: number) => void
) => {
    let value = e.target.value
    value = value.replace(/\D/g, "")
    value = value.replace(/^0+(?=\d)/, "")

    callback(value, index)
}

export const totalChangeHandler = (
    setter: Dispatch<SetStateAction<FormInputProps[]>>,
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
    index: number
) => {
    currencyChangeHandler(e, index, (value, index) =>
        setter((prev) =>
            prev.map((item, idx) =>
                idx === index ? { ...item, total: value === "" ? 0 : Number(value) } : item
            )
        )
    )
}

export const PPNChangeHandler = (
    setter: Dispatch<SetStateAction<FormInputProps[]>>,
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
    index: number
) => {
    currencyChangeHandler(e, index, (value, index) =>
        setter((prev) =>
            prev.map((item, idx) =>
                idx === index ? { ...item, ppn: value === "" ? 0 : Number(value) } : item
            )
        )
    )
}

export const PPhChangeHandler = (
    setter: Dispatch<SetStateAction<FormInputProps[]>>,
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
    index: number
) => {
    currencyChangeHandler(e, index, (value, index) =>
        setter((prev) =>
            prev.map((item, idx) =>
                idx === index ? { ...item, pph: value === "" ? 0 : Number(value) } : item
            )
        )
    )
}

export function parseMergeRanges(merges: string[]): ParsedMergeProps {
    const mergeMap = new Map<string, ExcelMergeInfoProps>()
    const hiddenCells = new Set<string>()

    merges.map((range) => {
        const [start, end] = range.split(":")
        const startCol = start.match(/[A-Z]+/)?.[0]
        const startRow = parseInt(start.match(/\d+/)?.[0] || "0", 10) - 1
        const endCol = end.match(/[A-Z]+/)?.[0]
        const endRow = parseInt(end.match(/\d+/)?.[0] || "0", 10) - 1

        if (!startCol || !endCol) return

        const colToIndex = (col: string): number =>
            col.split("").reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1
        const startColIndex = colToIndex(startCol)
        const endColIndex = colToIndex(endCol)
        const rowSpan = endRow - startRow + 1
        const colSpan = endColIndex - startColIndex + 1

        mergeMap.set(`${startRow}-${startColIndex}`, { rowSpan, colSpan })

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startColIndex; col <= endColIndex; col++) {
                if (row !== startRow || col !== startColIndex) {
                    hiddenCells.add(`${row}-${col}`)
                }
            }
        }
    })
    return { mergeMap, hiddenCells }
}

export function addNewFormHandler(
    formSetter: Dispatch<SetStateAction<FormInputProps[]>>,
    indexSetter: Dispatch<SetStateAction<number>>,
    initData: FormInputProps,
    dataLength: number
) {
    formSetter((prev) => [...prev, initData])
    indexSetter(dataLength)
}

export function formPrevHandler(setter: Dispatch<SetStateAction<number>>) {
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
