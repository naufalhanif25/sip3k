"use client"

import { useState } from "react"
import { cn } from "./lib/cn"
import { useRouter } from "next/navigation"
import CheckBox from "./components/checkbox"
import { UserLogin, UserLoginProps } from "./props/user"
import Input from "./components/input"
import { LogIn } from "lucide-react"
import variables from "./data/variables.json"

export default function Home() {
    const router = useRouter()
    const [userLogin, setUserLogin] = useState<UserLoginProps>(
        UserLogin.parse({
            username: "",
            password: "",
            isRemember: false,
        })
    )

    const handleSubmit = () => {
        // TODO: Login logic
        router.push("/dashboard")
    }

    return (
        <div
            className={cn(
                "w-dvw h-dvh gap-5 p-8",
                "flex flex-col items-center justify-center",
                "overflow-hidden"
            )}
        >
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
                        onChange={(e) =>
                            setUserLogin((prev) => ({
                                ...prev,
                                username: e.target.value,
                            }))
                        }
                        type="text"
                        placeholder="Nama pengguna"
                        className="w-full h-10 text-sm shrink-0"
                    />
                    <span className="flex w-full h-fit gap-1">
                        <Input
                            title="Kata Sandi"
                            onChange={(e) => {
                                setUserLogin((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                }))
                            }}
                            type="password"
                            placeholder="Kata sandi"
                            className="w-full h-10 text-sm shrink-0"
                        />
                    </span>
                    <CheckBox
                        title="Ingat saya"
                        className="w-fit h-fit gap-2"
                        active={userLogin.isRemember}
                        onClick={() =>
                            setUserLogin((prev) => ({
                                ...prev,
                                isRemember: !prev.isRemember,
                            }))
                        }
                    />
                </span>
                <button
                    onClick={handleSubmit}
                    className={cn(
                        "px-3 py-1 max-w-32 w-full h-10 rounded-md text-sm shrink-0",
                        "bg-indigo-400 text-white hover:bg-indigo-500",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "cursor-pointer flex items-center justify-center gap-2"
                    )}
                >
                    Masuk
                    <LogIn strokeWidth={2} className="size-4 text-white" />
                </button>
            </div>
            <p className="text-xs text-center max-w-86 text-wrap text-black/50">
                {variables.copyright}
            </p>
        </div>
    )
}
