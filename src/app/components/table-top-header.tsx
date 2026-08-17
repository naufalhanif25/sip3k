"use client"

import { cn } from "@/app/lib/global-utils"
import SearchBar from "@/app/components/search-bar"
import Pagination from "@/app/components/pagination"
import { type TableTopHeaderProps } from "@/app/props/component"

export default function TableTopHeader({
    title,
    onSearch,
    className,
    children,
    currentPage,
    totalPages,
    onPrevPage,
    onNextPage,
    ...props
}: TableTopHeaderProps) {
    return (
        <div
            className={cn(className, "px-1 py-2 gap-4", "flex items-center justify-between")}
            {...props}
        >
            <h2 className="font-semibold text-md truncate text-nowrap max-w-full min-w-20">
                {title}
            </h2>
            <span className={cn("flex-1 h-fit gap-2", "flex items-center justify-end")}>
                {onSearch && (
                    <SearchBar className="max-w-100 min-w-30 w-full h-7" onSearch={onSearch} />
                )}
                {children}
                <Pagination
                    className="w-fit h-fit"
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPrevPage={onPrevPage}
                    onNextPage={onNextPage}
                />
            </span>
        </div>
    )
}
