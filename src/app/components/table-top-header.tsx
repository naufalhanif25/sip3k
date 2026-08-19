"use client"

import { cn, valueValidator } from "@/app/lib/global-utils"
import SearchBar from "@/app/components/search-bar"
import Pagination from "@/app/components/pagination"
import { type TableTopHeaderProps } from "@/app/props/component"
import TextInput from "@/app/components/text-input"
import { useState } from "react"
import { MAX_LIST_LENGTH } from "@/app/vars/global-vars"

export default function TableTopHeader({
    title,
    onSearch,
    onPageSizeChange,
    className,
    children,
    currentPage,
    totalPages,
    onPrevPage,
    onNextPage,
    ...props
}: TableTopHeaderProps) {
    const [itemPerPage, setItemPerPage] = useState<string>("")

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
                <span className={cn("w-fit h-fit gap-2", "flex items-center justify-start")}>
                    <TextInput
                        className="text-center"
                        parentClassName="h-7 w-10 px-2 py-1"
                        type="text"
                        value={itemPerPage}
                        placeholder={`${MAX_LIST_LENGTH}`}
                        onChange={(event) => {
                            const value = event.target.value
                            if (!value) {
                                setItemPerPage("")
                                return
                            }
                            if (!valueValidator.isValidNumber(value)) return
                            setItemPerPage(value.replace(/^0+/, ""))
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && onPageSizeChange) {
                                onPageSizeChange(Number(itemPerPage))
                            }
                        }}
                    />
                </span>
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
