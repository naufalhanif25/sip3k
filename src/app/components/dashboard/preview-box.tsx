"use client"

import { Ellipsis } from "lucide-react"
import { useState } from "react"
import { Dropdown, DropdownButton } from "../dropdown"
import { cn } from "@/app/lib/cn"
import { ComponentRegistry } from "@/app/props/component"
import { PreviewBoxProps } from "@/app/props/dashboard"

export default function PreviewBox({
    data,
    title,
    description,
    className,
    ...props
}: PreviewBoxProps) {
    const [showMenu, setShowMenu] = useState<boolean>(false)
    const [openDropdown, setOpenDropdown] = useState<boolean>(false)

    return (
        <span
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
            className={cn(
                className,
                "flex flex-col items-center justify-end",
                "bg-indigo-100 border-2 border-indigo-300",
                "relative overflow-hidden rounded-lg"
            )}
        >
            {openDropdown && (
                <Dropdown className="w-fit min-w-32 max-w-48 h-fit p-1">
                    {data.map((button, index) => {
                        const SpecificComponent =
                            ComponentRegistry[button.icon as keyof typeof ComponentRegistry]

                        return (
                            <DropdownButton
                                key={index}
                                icon={<SpecificComponent className="size-4 shrink-0" />}
                                title={button.name}
                                className="h-10 w-full gap-2 px-3 py-2"
                                color={button.color}
                            />
                        )
                    })}
                </Dropdown>
            )}
            <span
                onClick={() => setOpenDropdown((prev) => !prev)}
                className={cn(
                    "size-6 absolute top-2 right-2",
                    "rounded-full bg-indigo-400",
                    "flex items-center justify-center",
                    showMenu || openDropdown ? "opacity-100" : "opacity-0",
                    "transition-opacity ease-out duration-100",
                    "overflow-hidden shrink-0 cursor-pointer"
                )}
            >
                <Ellipsis strokeWidth={2} className="size-3 text-white" />
            </span>
            <span className="w-full flex-1 overflow-hidden"></span>
            <span
                className={cn(
                    "w-full h-fit p-3",
                    "flex flex-col items-start justify-center",
                    "bg-indigo-300 overflow-hidden"
                )}
                {...props}
            >
                <h5
                    onClick={() => {
                        // TODO: Using clicked template logic
                    }}
                    className={cn(
                        "max-w-full h-fit",
                        "cursor-pointer hover:underline",
                        "font-semibold line-clamp-2"
                    )}
                >
                    {title}
                </h5>
                <p className="text-xs w-full h-fit line-clamp-3">{description}</p>
            </span>
        </span>
    )
}
