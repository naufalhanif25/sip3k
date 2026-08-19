"use client"

import { Search } from "lucide-react"
import { cn } from "@/app/lib/global-utils"
import Button from "@/app/components/button"
import { type SearchBarProps } from "@/app/props/component"
import { useState } from "react"
import TextInput from "@/app/components/text-input"

export default function SearchBar({ className, onSearch, ...props }: SearchBarProps) {
    const [searchInput, setSearchInput] = useState<string>("")

    return (
        <span className={cn(className, "flex items-center justify-start", "gap-2")}>
            <TextInput
                parentClassName="flex-1 h-full px-2 py-1"
                value={searchInput}
                type="text"
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter" && onSearch) {
                        onSearch(searchInput)
                    }
                }}
                placeholder="Cari Nama"
                {...props}
            />
            <Button
                onClick={() => onSearch && onSearch(searchInput)}
                className="aspect-square h-7 w-fit text-sm"
            >
                <Search className="size-4 shrink-0" />
            </Button>
        </span>
    )
}
