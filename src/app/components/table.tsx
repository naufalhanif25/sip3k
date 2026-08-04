"use client"

import { cn } from "../lib/cn"
import { HTMLAttributes, TdHTMLAttributes } from "react"
import { TableHeadProps } from "../props/component"

export function TableHeader({ names, className, ...props }: TableHeadProps) {
    const formattedNames = names.map((key) =>
        key
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    )

    return (
        <thead className={cn(className, "bg-indigo-200 border border-indigo-300")} {...props}>
            <tr className="text-sm font-semibold text-center">
                {formattedNames.map((name, index) => {
                    return (
                        <td key={index} className={cn("px-3 py-1", "border border-indigo-300")}>
                            {name}
                        </td>
                    )
                })}
            </tr>
        </thead>
    )
}

export function TableBody({
    className,
    children,
    ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <tbody className={cn(className, "bg-indigo-100 border border-indigo-300")} {...props}>
            {children}
        </tbody>
    )
}

export function TableRow({ className, children, ...props }: HTMLAttributes<HTMLTableRowElement>) {
    return (
        <tr className={cn(className, "text-sm")} {...props}>
            {children}
        </tr>
    )
}

export function TableCell({
    className,
    children,
    ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td className={cn(className, "px-3 py-1", "border border-indigo-300")} {...props}>
            {children}
        </td>
    )
}

export function Table({ className, children, ...props }: HTMLAttributes<HTMLTableElement>) {
    return (
        <table className={cn(className, "border border-indigo-300")} {...props}>
            {children}
        </table>
    )
}
