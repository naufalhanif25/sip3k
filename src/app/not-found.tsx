"use client"

import { cn } from "@/app/lib/global-utils"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotFound() {
    const router = useRouter()
    const handleBack = () => router.back()

    return (
        <div
            className={cn(
                "w-dvw h-dvh p-8 gap-8",
                "flex flex-col items-center justify-center",
                "overflow-hidden"
            )}
        >
            <div className={cn("flex flex-col items-center justify-center", "w-fit h-fit gap-2")}>
                <h1 className="text-center text-8xl font-semibold">404</h1>
                <h4 className="text-center font-medium">Halaman Tidak Ditemukan</h4>
            </div>
            <button
                onClick={handleBack}
                className={cn(
                    "h-10 px-5 rounded-md text-sm",
                    "cursor-pointer overflow-hidden",
                    "flex items-center justify-center gap-2",
                    "bg-indigo-400 text-white"
                )}
            >
                <ArrowLeft strokeWidth={2} className="size-4 text-white shrink-0" />
                Kembali
            </button>
        </div>
    )
}
