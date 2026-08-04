"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/app/lib/cn"
import Dashboard from "@/app/components/dashboard/dashboard"
import { DashboardSubPage } from "@/app/props/dashboard"
import { DocumentInitProps, DocumentInit, Division } from "@/app/props/component"
import MainSPTJB from "@/app/components/dashboard/sptjb/main-sptjb"
import variables from "../../data/variables.json"
import NewSPTJB from "@/app/components/dashboard/sptjb/new-sptjb"

export default function SPTJB() {
    const path = usePathname()
    const target = variables.paths.find((data) => data.route === path)
    const subPageData = DashboardSubPage.parse({
        title: target?.name ?? path.replace(/\b\w/g, (char) => char.toUpperCase()),
        description: target?.description ?? path.replace(/\b\w/g, (char) => char.toUpperCase()),
    })
    const [openEditor, setOpenEditor] = useState<boolean>(false)
    const [documenInitInput, setDocumentInitInput] = useState<DocumentInitProps>(
        DocumentInit.parse({
            name: "",
            division: null,
        })
    )

    const onCreate = () => {
        if (!documenInitInput.name && documenInitInput.division === null) return
        setOpenEditor(true)
    }

    return (
        <Dashboard
            className={cn(
                "w-dvw h-dvh",
                "flex flex-col items-start justify-center",
                "overflow-hidden"
            )}
        >
            <div
                className={cn(
                    "flex flex-col items-start justify-start",
                    "p-4 gap-4 w-full h-full",
                    "relative"
                )}
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
                {openEditor ? (
                    <NewSPTJB
                        data={documenInitInput}
                        className={cn("w-full flex-1 overflow-hidden", "flex flex-col gap-2")}
                        onDelete={() => {}}
                        onSave={() => {}}
                        onPrint={() => {}}
                        onBack={() => setOpenEditor(false)}
                        onNameChange={(e) =>
                            setDocumentInitInput((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        onChoose={(value) =>
                            setDocumentInitInput((prev) => ({
                                ...prev,
                                division: value as Division,
                            }))
                        }
                    />
                ) : (
                    <MainSPTJB
                        data={documenInitInput}
                        onNameChange={(e) =>
                            setDocumentInitInput((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        onChoose={(value) =>
                            setDocumentInitInput((prev) => ({
                                ...prev,
                                division: value as Division,
                            }))
                        }
                        onCreate={onCreate}
                        className={cn("w-full flex-1 overflow-hidden", "flex flex-col gap-4")}
                    />
                )}
            </div>
        </Dashboard>
    )
}
