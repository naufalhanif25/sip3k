"use client"

import { cn } from "@/app/lib/global-utils"
import Input from "@/app/components/input"
import Dropdown from "@/app/components/dropdown"
import Button from "@/app/components/button"
import { Plus } from "lucide-react"
import { type MainSPTJBProps } from "@/app/props/sptjb"
import variables from "@/app/data/variables.json"
import { useEffect, useState } from "react"
import DocumentList from "@/app/components/dashboard/sptjb/document-list"
import { type SPTJBProps } from "@/app/props/db"
import { handleGetDocumentData } from "@/app/lib/sptjb-fetch-handler"
import { useBudgetClass } from "@/app/hooks/sptjb"

export default function MainSPTJB({
    data,
    onNameChange,
    onDivisionChoose,
    onClassChoose,
    onCreate,
    onItemOpen,
    onItemDelete,
    onItemView,
    errorFallback,
    className,
    ...props
}: MainSPTJBProps) {
    const [documents, setDocuments] = useState<SPTJBProps[] | null>(null)
    const { budgetClass, classValue } = useBudgetClass(data.division, data._class, onClassChoose)
    const handleItemDelete = (id: string) => {
        if (onItemDelete)
            onItemDelete(
                () =>
                    handleGetDocumentData(
                        (_, resData) => setDocuments(resData),
                        (message) => errorFallback("Gagal Menghapus Dokumen", message)
                    ),
                id
            )
    }

    useEffect(() => {
        const controller = new AbortController()
        const { signal } = controller

        handleGetDocumentData(
            (_, resData) => setDocuments(resData),
            (message) => errorFallback("Gagal Mengambil Data Dokumen", message),
            signal
        )
        return () => {
            controller.abort()
        }
    }, [errorFallback])

    return (
        <div className={className} {...props}>
            <div
                className={cn(
                    "w-full h-fit gap-4 rounded-lg p-4",
                    "flex flex-col items-center justify-start",
                    "bg-indigo-100"
                )}
            >
                <span
                    className={cn("w-full h-fit gap-2", "flex flex-col items-start justify-center")}
                >
                    <Input
                        title="Nama Dokumen"
                        type="text"
                        value={data.name}
                        onChange={onNameChange}
                        className="w-full min-w-0 sm:flex-1 min-h-10 text-sm shrink-0"
                        placeholder="Nama Dokumen"
                    />
                    <span
                        className={cn(
                            "w-full h-fit gap-2",
                            "flex flex-col sm:flex-row items-center justify-center"
                        )}
                    >
                        <Dropdown
                            className="w-full min-w-0 sm:w-1/2 shrink-0 h-fit gap-2"
                            title="Bidang"
                            placeholder="Pilih Bidang"
                            options={variables.divisions.sort()}
                            value={data.division}
                            onChoose={onDivisionChoose}
                        />
                        <Dropdown
                            className="w-full max-w-full min-w-0 sm:w-1/2 shrink-0 h-fit gap-2"
                            title="Klasifikasi"
                            placeholder="Pilih Kode Klasifikasi"
                            active={Boolean(data.division)}
                            options={data.division ? budgetClass.sort() : []}
                            value={classValue}
                            onChoose={onClassChoose}
                        />
                    </span>
                </span>
                <span className={cn("w-full h-fit gap-2", "flex items-start justify-start")}>
                    <Button onClick={() => onCreate && onCreate()} className="px-5 py-1 h-10 w-fit">
                        <Plus className="shrink-0 size-4 text-white" />
                        <p className="hidden xs:block">Buat Dokumen</p>
                    </Button>
                </span>
            </div>
            <DocumentList
                onOpenTrigger={onItemOpen}
                onDeleteTrigger={handleItemDelete}
                onViewTrigger={(id) => onItemView && onItemView(id)}
                data={documents}
                className="w-full h-fit"
            />
        </div>
    )
}
