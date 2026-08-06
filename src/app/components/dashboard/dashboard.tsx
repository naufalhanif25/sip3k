"use client"

import { cn } from "@/app/lib/cn"
import { useRouter, usePathname } from "next/navigation"
import { SidebarOpen, SidebarClose, CircleUserRound, LogOut } from "lucide-react"
import { DashboardProps } from "@/app/props/dashboard"
import { useState } from "react"
import variables from "../../data/variables.json"
import DashboardSidebarButton from "./sidebar-button"
import { ComponentRegistry } from "@/app/props/component"
import Notification from "../notification"
import { PopupStateProps, PopupState } from "@/app/props/component"
import { BasicAPIResponseProps } from "@/app/props/api"
import InfoPopup from "../info-popup"

export default function Dashboard({ children, className, ...props }: DashboardProps) {
    const router = useRouter()
    const path = usePathname()
    const [openSidebar, setOpenSidebar] = useState<boolean>(false)
    const [popupState, setPopupState] = useState<PopupStateProps>(
        PopupState.parse({
            show: false,
            title: "",
            description: "",
            type: "notification",
        })
    )
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const handleSetSidebarState = () => setOpenSidebar((prev) => !prev)
    const handleShowInfoLogout = () => {
        setOpenSidebar(false)
        setShowPopup(true)
    }
    const handleSetNotificationState = () =>
        setPopupState((prev) => ({
            ...prev,
            show: !prev.show,
        }))
    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await res.json()

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Terjadi kesalahan saat keluar.")
            }
            router.push("/")
        } catch (err) {
            if (popupState.show) handleSetNotificationState()
            setTimeout(() => {
                setPopupState(
                    PopupState.parse({
                        show: true,
                        title: "Gagal Keluar",
                        description:
                            (err as BasicAPIResponseProps).message || "Terjadi kesalahan koneksi.",
                        type: "error",
                    })
                )
            }, 1)
        } finally {
            handleSetPopupState()
        }
    }
    const handlePageChange = (route: string) => {
        router.push(route)
    }
    const handleSetPopupState = () => {
        setShowPopup((prev) => !prev)
    }

    return (
        <div className={className} {...props}>
            <div
                className={cn(
                    "flex flex-col items-start justify-center",
                    "w-full h-fit px-5 py-3 z-200",
                    "bg-indigo-300"
                )}
            >
                <h2 className="text-lg font-semibold leading-6">{variables.shortform}</h2>
                <h3 className="text-xs font-medium">{variables.longform}</h3>
            </div>
            {popupState.show && (
                <Notification
                    className={cn("py-3 px-5 w-fit h-fit")}
                    onClose={handleSetNotificationState}
                    title={popupState.title}
                    type={popupState.type}
                    description={popupState.description}
                />
            )}
            {showPopup && (
                <div
                    className={cn(
                        "absolute top-0 left-0 w-full h-full p-8",
                        "flex items-center justify-center",
                        "overflow-hidden bg-black/50 z-150"
                    )}
                >
                    <InfoPopup
                        className="max-w-80 w-full p-5 gap-4"
                        title="PERINGATAN"
                        description="Apakah Anda yakin ingin keluar? Pastikan seluruh perubahan telah Anda simpan."
                        dismissTitle="Batal"
                        acceptTitle="Keluar"
                        onDismiss={handleSetPopupState}
                        onAccept={handleLogout}
                        onClose={handleSetPopupState}
                    />
                </div>
            )}
            <div
                className={cn(
                    "w-full flex-1",
                    "flex items-center justify-start",
                    "overflow-hidden"
                )}
            >
                <div
                    className={cn(
                        "flex items-center justify-center",
                        "w-full h-full",
                        "relative overflow-hidden"
                    )}
                >
                    <div
                        className={cn(
                            "h-full w-full z-100",
                            "absolute top-0 left-0",
                            "flex items-center justify-center pointer-events-none"
                        )}
                    >
                        <div
                            className={cn(
                                "w-fit h-full flex",
                                "transition-[max-width] ease-out duration-200",
                                "relative pointer-events-auto"
                            )}
                        >
                            <div
                                className={cn(
                                    "w-52 h-full max-w-screen flex flex-col overflow-hidden",
                                    openSidebar ? "max-w-52" : "max-w-0",
                                    "bg-indigo-100 border-r-2 border-indigo-200",
                                    "transition-[max-width] ease-out duration-200",
                                    "pointer-events-auto"
                                )}
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
                                        onClick={handleSetSidebarState}
                                    />
                                </span>
                                <span
                                    className={cn(
                                        "flex flex-col overflow-y-auto",
                                        "w-full flex-1 px-2"
                                    )}
                                >
                                    {variables.paths.map((button, index) => {
                                        const SpecificComponent =
                                            ComponentRegistry[
                                                button.icon as keyof typeof ComponentRegistry
                                            ]

                                        return (
                                            <DashboardSidebarButton
                                                key={index}
                                                onClick={() => handlePageChange(button.route)}
                                                className={cn(
                                                    "w-full h-10 gap-2 px-3",
                                                    path === button.route && "bg-indigo-300"
                                                )}
                                                icon={
                                                    <SpecificComponent
                                                        strokeWidth={2}
                                                        className="size-4 shrink-0"
                                                    />
                                                }
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
                                        title="Admin"
                                    />
                                    <DashboardSidebarButton
                                        onClick={handleShowInfoLogout}
                                        className="w-full h-10 gap-2 px-3"
                                        icon={<LogOut className="size-4 shrink-0" />}
                                        color="var(--color-red-500)"
                                        title="Keluar"
                                    />
                                </span>
                            </div>
                            {!openSidebar && (
                                <div
                                    className={cn(
                                        "h-full w-fit flex py-2",
                                        "absolute left-full top-0"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "group flex items-center justify-center",
                                            "px-1 hover:px-2 py-2 w-fit h-fit rounded-r-lg",
                                            "overflow-hidden cursor-pointer",
                                            "max-w-0 hover:max-w-16",
                                            "transition-[max-width,padding] ease-out duration-200",
                                            "bg-indigo-400"
                                        )}
                                        onClick={handleSetSidebarState}
                                    >
                                        <SidebarOpen
                                            strokeWidth={2}
                                            className={cn(
                                                "size-5 text-white shrink-0",
                                                "opacity-0 group-hover:opacity-100",
                                                "transition-opacity ease-out duration-100"
                                            )}
                                        />
                                    </span>
                                </div>
                            )}
                        </div>
                        <div
                            onClick={handleSetSidebarState}
                            className={cn(
                                openSidebar
                                    ? "opacity-50 pointer-events-auto"
                                    : "opacity-0 pointer-events-none",
                                "w-full h-full bg-black",
                                "transition-opacity ease-out duration-100"
                            )}
                        ></div>
                    </div>
                    <div className="flex-1 h-full overflow-hidden">{children}</div>
                </div>
            </div>
        </div>
    )
}
