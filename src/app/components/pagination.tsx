"use client"

import { cn } from "@/app/lib/global-utils"
import Button from "@/app/components/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { type PaginationProps } from "@/app/props/component"

export default function Pagination({
    currentPage,
    totalPages,
    onPrevPage,
    onNextPage,
    className,
    ...props
}: PaginationProps) {
    return (
        <span className={cn(className, "gap-1 flex items-center justify-center")} {...props}>
            <Button
                disabled={currentPage === 1}
                onClick={() => onPrevPage && onPrevPage()}
                className="h-7 aspect-square w-fit text-sm"
            >
                <ChevronLeft className="size-4 shrink-0" />
            </Button>
            <span
                className={cn(
                    "h-7 w-12",
                    "rounded-md border-2 border-indigo-400",
                    "flex items-center justify-center",
                    "overflow-hidden"
                )}
            >
                {currentPage}/{totalPages}
            </span>
            <Button
                disabled={currentPage === totalPages}
                onClick={() => onNextPage && onNextPage()}
                className="h-7 aspect-square w-fit text-sm"
            >
                <ChevronRight className="size-4 shrink-0" />
            </Button>
        </span>
    )
}
