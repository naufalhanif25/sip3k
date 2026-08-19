import { useMemo, useRef, useEffect } from "react"
import { Division } from "@/app/props/sptjb"
import variables from "@/app/data/variables.json"

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
