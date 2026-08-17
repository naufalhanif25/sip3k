"use client"

import { cn } from "@/app/lib/global-utils"
import { SidebarClose, CircleUserRound, LogOut } from "lucide-react"
import DashboardSidebarButton from "@/app/components/dashboard/sidebar-button"
import { ComponentRegistry } from "@/app/props/component"
import { type SidebarProps } from "@/app/props/dashboard"
import variables from "@/app/data/variables.json"

export default function Sidebar({
    open,
    path,
    data,
    onPageChange,
    onLogOut,
    onClose,
    className,
    ...props
}: SidebarProps) {
    return (
        <div
            className={cn(
                className,
                "flex flex-col overflow-hidden",
                open ? "max-w-52" : "max-w-0",
                "bg-indigo-100 border-r-2 border-indigo-200",
                "transition-[max-width] ease-out duration-200",
                "pointer-events-auto"
            )}
            {...props}
        >
            <span
                className={cn(
                    "flex items-center justify-center",
                    "gap-2 mx-4 my-2 py-2 overflow-hidden"
                )}
            >
                <h2 className="font-semibold flex-1 min-w-fit">Menu</h2>
                <SidebarClose
                    strokeWidth={2}
                    className="size-5 text-indigo-500 cursor-pointer shrink-0"
                    onClick={onClose}
                />
            </span>
            <span className={cn("flex flex-col overflow-y-auto", "w-full flex-1 px-2")}>
                {variables.paths.map((button, index) => {
                    const SpecificComponent =
                        ComponentRegistry[button.icon as keyof typeof ComponentRegistry]

                    return (
                        <DashboardSidebarButton
                            key={index}
                            onClick={() => onPageChange && onPageChange(button.route)}
                            className={cn(
                                "w-full h-10 gap-2 px-3",
                                path === button.route && "bg-indigo-300"
                            )}
                            icon={<SpecificComponent strokeWidth={2} className="size-4 shrink-0" />}
                            color="black"
                            title={button.name}
                        />
                    )
                })}
            </span>
            <span
                className={cn(
                    "flex flex-col items-start justify-center",
                    "w-full h-fit px-2 my-2",
                    "overflow-hidden"
                )}
            >
                <DashboardSidebarButton
                    className="w-full h-10 gap-2 px-3"
                    icon={<CircleUserRound className="size-4 shrink-0" />}
                    color="black"
                    title={data.username}
                />
                <DashboardSidebarButton
                    onClick={onLogOut}
                    className="w-full h-10 gap-2 px-3"
                    icon={<LogOut className="size-4 shrink-0" />}
                    color="var(--color-red-500)"
                    title="Keluar"
                />
            </span>
        </div>
    )
}
