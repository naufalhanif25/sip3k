"use client"

import { usePathname } from "next/navigation"
import PreviewBox from "@/app/components/dashboard/preview-box"
import { cn } from "@/app/lib/cn"
import Dashboard from "@/app/components/dashboard/dashboard"
import { DashboardSubPage } from "@/app/props/dashboard"
import variables from "../../data/variables.json"

export default function Docs() {
    const path = usePathname()
    const target = variables.paths.find((data) => data.route === path)
    const subPageData = DashboardSubPage.parse({
        title: target?.name ?? path.replace(/\b\w/g, (char) => char.toUpperCase()),
        description: target?.description ?? path.replace(/\b\w/g, (char) => char.toUpperCase()),
    })

    return (
        <Dashboard
            className={cn(
                "w-dvw h-dvh",
                "flex flex-col items-start justify-center",
                "overflow-hidden"
            )}
        >
            <div
                className={cn("flex flex-col items-start justify-start", "p-4 gap-3 w-full h-full")}
            >
                <div
                    className={cn(
                        "w-full h-fit py-2 px-4",
                        "flex flex-col",
                        "bg-indigo-100 border-b-2 border-indigo-300"
                    )}
                >
                    <h2 className="text-lg font-semibold w-full truncate">{subPageData.title}</h2>
                    <h4 className="text-xs w-full line-clamp-2">{subPageData.description}</h4>
                </div>
                <div className="w-full flex-1 overflow-y-auto">
                    <div
                        className={cn(
                            "w-full h-fit gap-2",
                            "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
                            "lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"
                        )}
                    >
                        <PreviewBox
                            data={variables.dropdown.docs}
                            className="w-full h-64"
                            title="SPTJB"
                            description="Templat Dokumen SPTJB"
                        />
                    </div>
                </div>
            </div>
        </Dashboard>
    )
}
