"use client"

import { cn } from "@/app/lib/global-utils"
import { useRouter, usePathname } from "next/navigation"
import { SidebarOpen } from "lucide-react"
import { type DashboardProps } from "@/app/props/dashboard"
import { useEffect, useState } from "react"
import variables from "@/app/data/variables.json"
import Notification from "@/app/components/notification"
import { UserData, type UserDataProps } from "@/app/props/api"
import Sidebar from "@/app/components/dashboard/sidebar"
import InfoPopup from "@/app/components/info-popup"
import { POPUP_DATA_DEFAULT, USER_DATA_DEFAULT } from "@/app/vars/global-vars"
import { handleUserLogout } from "@/app/lib/user-fetch-handler"
import { useNotification } from "@/app/hooks/dashboard"
import FloatingContainer from "@/app/components/floating-container"

export default function Dashboard({ children, className, ...props }: DashboardProps) {
    const router = useRouter()
    const path = usePathname()
    const [openSidebar, setOpenSidebar] = useState<boolean>(false)
    const { notificationState, setVisibilityState, showNotification } =
        useNotification(POPUP_DATA_DEFAULT)
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [userData, setUserData] = useState<UserDataProps>(USER_DATA_DEFAULT)

    useEffect(() => {
        const loadLocalStorageData = () => {
            const user = localStorage.getItem("user")
            if (!user) return

            const parsedUser = JSON.parse(user)
            setUserData(UserData.parse(parsedUser))
        }
        loadLocalStorageData()
    }, [])

    const handleSetSidebarState = () => setOpenSidebar((prev) => !prev)
    const handleShowInfoLogout = () => {
        setOpenSidebar(false)
        setShowPopup(true)
    }
    const handleLogout = () => {
        handleUserLogout(
            () => {
                localStorage.removeItem("user")
                router.push("/")
            },
            (message) => showNotification("Gagal Keluar", message, "error")
        )
        handleSetPopupState()
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
            {notificationState.show && (
                <Notification
                    className={cn("py-3 px-5 w-fit h-fit")}
                    onClose={setVisibilityState}
                    title={notificationState.title}
                    type={notificationState.type}
                    description={notificationState.description}
                />
            )}
            {showPopup && (
                <FloatingContainer className="w-full h-full z-150">
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
                </FloatingContainer>
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
                            <Sidebar
                                className="w-52 h-full max-w-screen"
                                open={openSidebar}
                                path={path}
                                data={userData}
                                onPageChange={(route) => handlePageChange(route)}
                                onLogOut={handleShowInfoLogout}
                                onClose={handleSetSidebarState}
                            />
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
