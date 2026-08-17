import { useState, useMemo, useRef, useEffect } from "react"
import { MAX_LIST_LENGTH } from "@/app/vars/global-vars"
import { Division } from "@/app/props/sptjb"
import variables from "@/app/data/variables.json"

export function usePagination<T>(
    data?: T[] | null,
    options?: {
        pageSize?: number
    }
) {
    const pageSize = options?.pageSize ?? MAX_LIST_LENGTH
    const [currentPage, setCurrentPage] = useState<number>(1)
    const totalPages = useMemo(() => {
        if (!data || data.length === 0) return 1
        return Math.ceil(data.length / pageSize)
    }, [data, pageSize])
    const renderData = useMemo(() => {
        if (!data) return null
        const startIndex = (currentPage - 1) * pageSize
        return data.slice(startIndex, startIndex + pageSize)
    }, [data, currentPage, pageSize])
    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }
    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }
    return {
        currentPage,
        totalPages,
        renderData,
        handlePrevPage,
        handleNextPage,
    }
}

export function useBudgetClass(
    division?: string | null,
    _class?: string,
    onClassChoose?: (value: string) => void
) {
    const budgetClass = useMemo(() => {
        if (!division) return []
        return variables.budgetclass[division as Division]
    }, [division])
    const classValue = useMemo(() => {
        const currentClassCodes = budgetClass
        if (!currentClassCodes) return ""

        const isDivisionChanged = !new Set(currentClassCodes).has(_class || "")
        if (isDivisionChanged) return currentClassCodes[0]

        return _class || (division ? currentClassCodes[0] : "")
    }, [budgetClass, _class, division])
    const onClassChooseRef = useRef(onClassChoose)

    useEffect(() => {
        onClassChooseRef.current = onClassChoose
    }, [onClassChoose])
    useEffect(() => {
        if (onClassChooseRef.current) onClassChooseRef.current(classValue)
    }, [classValue])

    return {
        budgetClass,
        classValue,
    }
}
