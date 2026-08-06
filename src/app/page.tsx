"use client"

import { ChangeEvent, useState } from "react"
import { cn } from "./lib/cn"
import { useRouter } from "next/navigation"
import CheckBox from "./components/checkbox"
import { UserLogin, UserLoginProps } from "./props/user"
import Input from "./components/input"
import Button from "./components/button"
import { LogIn } from "lucide-react"
import Notification from "./components/notification"
import { PopupState, PopupStateProps } from "./props/component"
import { BasicAPIResponseProps, BasicAPIResponse } from "./props/api"
import variables from "./data/variables.json"

export default function Home() {
    const router = useRouter()
    const [popupState, setPopupState] = useState<PopupStateProps>(
        PopupState.parse({
            show: false,
            title: "",
            description: "",
            type: "notification",
        })
    )
    const [userLogin, setUserLogin] = useState<UserLoginProps>(
        UserLogin.parse({
            username: "",
            password: "",
            isRemember: false,
        })
    )
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)
    const handleSubmit = async () => {
        if (!userLogin.username || !userLogin.password) {
            if (popupState.show) handleSetNotificationState()
            setTimeout(() => {
                setPopupState(
                    PopupState.parse({
                        show: true,
                        title: "Gagal Masuk",
                        description: "Nama pengguna atau kata sandi tidak boleh kosong.",
                        type: "error",
                    })
                )
            }, 1)
            return
        }
        setIsLoggingIn(true)

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userLogin),
            })
            const data = BasicAPIResponse.parse(await res.json())

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Pastikan nama pengguna dan kata sandi benar.")
            }
            router.push("/dashboard")
        } catch (err) {
            if (popupState.show) handleSetNotificationState()
            setTimeout(() => {
                setPopupState(
                    PopupState.parse({
                        show: true,
                        title: "Gagal Masuk",
                        description:
                            (err as BasicAPIResponseProps).message || "Terjadi kesalahan koneksi.",
                        type: "error",
                    })
                )
            }, 1)
        } finally {
            setIsLoggingIn(false)
        }
    }
    const handleSetNotificationState = () =>
        setPopupState((prev) => ({
            ...prev,
            show: !prev.show,
        }))
    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) =>
        setUserLogin((prev) => ({
            ...prev,
            username: e.target.value,
        }))
    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) =>
        setUserLogin((prev) => ({
            ...prev,
            password: e.target.value,
        }))
    const handleIsRememberChange = () =>
        setUserLogin((prev) => ({
            ...prev,
            isRemember: !prev.isRemember,
        }))

    return (
        <div
            className={cn(
                "w-dvw h-dvh gap-5 p-8",
                "flex flex-col items-center justify-center",
                "overflow-x-auto relative"
            )}
        >
            {popupState.show && (
                <Notification
                    className={cn("py-3 px-5 w-fit h-fit")}
                    onClose={handleSetNotificationState}
                    title={popupState.title}
                    type={popupState.type}
                    description={popupState.description}
                />
            )}
            <div
                className={cn(
                    "w-full h-fit rounded-2xl min-w-48 max-w-86",
                    "bg-indigo-100 border-2 border-indigo-200",
                    "flex flex-col items-center justify-start",
                    "gap-6 py-8 px-6 overflow-y-auto scrollbar-none"
                )}
            >
                <span className={cn("flex flex-col items-center justify-center gap-2")}>
                    <LogIn strokeWidth={2} className="size-10 text-indigo-500 shrink-0" />
                    <span
                        className={cn(
                            "flex flex-col items-center justify-center",
                            "gap-1 w-fit h-fit shrink-0"
                        )}
                    >
                        <h1 className="text-2xl font-semibold">{variables.shortform}</h1>
                        <h3 className="text-sm text-center font-medium">{variables.longform}</h3>
                    </span>
                </span>
                <span className={cn("w-full flex-1 gap-3", "flex flex-col")}>
                    <Input
                        title="Nama Pengguna"
                        onChange={(e) => handleUsernameChange(e)}
                        value={userLogin.username}
                        type="text"
                        placeholder="Nama pengguna"
                        className="w-full h-10 text-sm shrink-0"
                    />
                    <span className="flex w-full h-fit gap-1">
                        <Input
                            title="Kata Sandi"
                            onChange={(e) => handlePasswordChange(e)}
                            value={userLogin.password}
                            type="password"
                            placeholder="Kata sandi"
                            className="w-full h-10 text-sm shrink-0"
                        />
                    </span>
                    <CheckBox
                        title="Ingat saya"
                        className="w-fit h-fit gap-2"
                        active={userLogin.isRemember}
                        onClick={handleIsRememberChange}
                    />
                </span>
                <Button
                    disabled={isLoggingIn}
                    onClick={handleSubmit}
                    className={cn(
                        "px-3 py-1 max-w-32 w-full h-10",
                        "disabled:pointer-events-none disabled:select-none",
                        "disabled:bg-indigo-300"
                    )}
                >
                    {isLoggingIn ? (
                        "Masuk..."
                    ) : (
                        <>
                            Masuk
                            <LogIn strokeWidth={2} className="size-4 text-white" />
                        </>
                    )}
                </Button>
            </div>
            <p className="text-xs text-center max-w-86 text-wrap text-black/50">
                {variables.copyright}
            </p>
        </div>
    )
}
