"use client"

import { Search } from "lucide-react"
import { cn } from "@/app/lib/global-utils"
import Button from "@/app/components/button"
import { type SearchBarProps } from "@/app/props/component"
import { useState } from "react"
import { useFocus } from "@/app/hooks/component"

export default function SearchBar({ className, onSearch, ...props }: SearchBarProps) {
    const { isFocus, handleFocus, handleUnfocus } = useFocus()
    const [searchInput, setSearchInput] = useState<string>("")

    return (
        <span className={cn(className, "flex items-center justify-start", "gap-2")}>
            <span
                className={cn(
                    "flex-1 h-full px-3 py-1",
                    "flex items-center justify-start",
                    "bg-indigo-50 overflow-hidden rounded-md",
                    isFocus ? "outline-indigo-400 outline-2" : "outline-indigo-200 outline"
                )}
                {...props}
            >
                <input
                    onFocus={handleFocus}
                    onBlur={handleUnfocus}
                    className="w-full h-full outline-none text-sm"
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Cari Nama"
                />
            </span>
            <Button
                onClick={() => onSearch && onSearch(searchInput)}
                className="aspect-square h-7 w-fit text-sm"
            >
                <Search className="size-4 shrink-0" />
            </Button>
        </span>
    )
}
