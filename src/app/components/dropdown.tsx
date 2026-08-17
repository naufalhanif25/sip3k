"use client"

import { cn } from "@/app/lib/global-utils"
import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { type DropdownProps } from "@/app/props/component"

export default function Dropdown({
    onChoose,
    title,
    placeholder,
    active = true,
    options,
    value,
    className,
    ...props
}: DropdownProps) {
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const [openDropdown, setOpenDropdown] = useState<boolean>(false)
    const handleSetDropdownState = () => setOpenDropdown((prev) => !prev)
    const handleOptionChoose = (option: string) => {
        if (onChoose) onChoose(option)
        setOpenDropdown(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(false)
            }
        }
        if (openDropdown) document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [openDropdown])

    return (
        <div
            ref={dropdownRef}
            className={cn(className, "flex flex-col items-center justify-center", "relative")}
            {...props}
        >
            <div className={cn("flex flex-col w-full h-fit gap-1")}>
                {title && <h3 className="text-sm font-medium text-black/75">{title}</h3>}
                <span
                    onClick={active ? handleSetDropdownState : () => {}}
                    className={cn(
                        "w-full max-w-full px-3 py-1 h-10 gap-2",
                        "rounded-md bg-indigo-50 outline outline-indigo-200",
                        "flex items-center justify-between",
                        "cursor-pointer overflow-hidden",
                        active
                            ? "pointer-events-auto opacity-100"
                            : "pointer-events-none select-none opacity-50"
                    )}
                >
                    <p
                        className={cn(
                            "cursor-pointer text-sm flex-1 truncate",
                            value ? "text-black" : "text-black/50"
                        )}
                    >
                        {value || placeholder}
                    </p>
                    <ChevronDown
                        className={cn(
                            "size-4 shrink-0",
                            openDropdown && "rotate-180",
                            "transition east-out duration-100"
                        )}
                    />
                </span>
                <span
                    className={cn(
                        "absolute z-200 top-full left-0",
                        "w-full min-w-fit h-fit mt-1",
                        "flex flex-col items-center justify-center",
                        "bg-indigo-100 outline outline-indigo-200 rounded-md",
                        openDropdown ? "max-h-100 opacity-100" : "max-h-0 opacity-0",
                        "transition-[max-height,opacity] ease-out duration-100",
                        "overflow-hidden"
                    )}
                >
                    <span
                        className={cn("w-full h-fit max-h-50", "overscroll-none overflow-y-auto")}
                    >
                        {options.map((option, index) => {
                            return (
                                <span
                                    key={index}
                                    onClick={() => handleOptionChoose(option)}
                                    className={cn(
                                        "px-3 py-1 h-10 w-full min-w-fit",
                                        "flex items-center justify-start",
                                        option === value
                                            ? "bg-indigo-100"
                                            : "bg-indigo-50 hover:bg-indigo-100",
                                        "transition duration-100 ease-out",
                                        "cursor-pointer truncate text-sm"
                                    )}
                                >
                                    {option}
                                </span>
                            )
                        })}
                    </span>
                </span>
            </div>
        </div>
    )
}
