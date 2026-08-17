"use client"

import { ChangeEvent, useState } from "react"
import { cn } from "@/app/lib/global-utils"
import { useRouter } from "next/navigation"
import CheckBox from "@/app/components/checkbox"
import { type UserLoginProps } from "@/app/props/user"
import Input from "@/app/components/input"
import Button from "@/app/components/button"
import { LogIn } from "lucide-react"
import Notification from "@/app/components/notification"
import variables from "@/app/data/variables.json"
import { POPUP_DATA_DEFAULT, USER_LOGIN_DATA_DEFAULT } from "@/app/vars/global-vars"
import { handleUserLogin } from "@/app/lib/user-fetch-handler"
import { useNotification } from "@/app/hooks/dashboard"
import * as UserHandler from "@/app/lib/user-handler"

export default function Home() {
    const router = useRouter()
    const [userLogin, setUserLogin] = useState<UserLoginProps>(USER_LOGIN_DATA_DEFAULT)
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)
    const { notificationState, setVisibilityState, showNotification } =
        useNotification(POPUP_DATA_DEFAULT)
    const handleLogin = async () => {
        if (!userLogin.username || !userLogin.password) {
            showNotification(
                "Gagal Masuk",
                "Nama pengguna atau kata sandi tidak boleh kosong.",
                "error"
            )
            return
        }
        setIsLoggingIn(true)

        try {
            await handleUserLogin(
                userLogin,
                (data) => {
                    localStorage.setItem("user", JSON.stringify(data.data))
                    router.push("/dashboard")
                },
                (message) => showNotification("Gagal Masuk", message, "error")
            )
        } catch (err) {
            showNotification(
                "Gagal Masuk",
                (err as string) || "Terjadi kesalahan koneksi.",
                "error"
            )
        } finally {
            setIsLoggingIn(false)
        }
    }
    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) =>
        UserHandler.handleChangeUsername(setUserLogin, event)
    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) =>
        UserHandler.handleChangePassword(setUserLogin, event)
    const handleIsRememberChange = () => UserHandler.handleChangeIsRemember(setUserLogin)

    return (
        <div
            className={cn(
                "w-dvw h-dvh gap-5 p-8",
                "flex flex-col items-center justify-center",
                "overflow-x-auto relative"
            )}
        >
            {notificationState.show && (
                <Notification
                    className={cn("py-3 px-5 w-fit h-fit")}
                    onClose={setVisibilityState}
                    title={notificationState.title}
                    type={notificationState.type}
                    description={notificationState.description}
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
                        onChange={(event) => handleUsernameChange(event)}
                        value={userLogin.username}
                        type="text"
                        placeholder="Nama pengguna"
                        className="w-full h-10 text-sm shrink-0"
                    />
                    <span className="flex w-full h-fit gap-1">
                        <Input
                            title="Kata Sandi"
                            onChange={(event) => handlePasswordChange(event)}
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
                    onClick={handleLogin}
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
