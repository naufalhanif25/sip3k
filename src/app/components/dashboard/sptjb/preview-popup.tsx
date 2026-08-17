"use client"

import { cn } from "@/app/lib/global-utils"
import { SPTJBPreview } from "@/app/components/dashboard/sptjb/sptjb-preview"
import { type TemplateGetResponseProps } from "@/app/props/api"
import { type PreviewPopupProps, type SPTJBBasicMetadataProps } from "@/app/props/sptjb"
import { forwardRef, useEffect } from "react"
import { useState } from "react"
import { handleGetTemplate } from "@/app/lib/sptjb-fetch-handler"
import { PenBox, Printer, X } from "lucide-react"
import Button from "@/app/components/button"
import { getMetadata } from "@/app/lib/sptjb-main-handle"

export const PreviewPopup = forwardRef<HTMLDivElement, PreviewPopupProps>(function PreviewPopup(
    { formData, data, className, onClose, onOpen, onPrint, errorFallback, ...props },
    ref
) {
    const [metadata, setMetadata] = useState<SPTJBBasicMetadataProps | null>(null)
    const [templateData, setTemplateData] = useState<TemplateGetResponseProps | null>(null)

    useEffect(() => {
        const collectData = () => {
            if (!data.id || !formData) return
            const resMetadat = getMetadata(data, formData, templateData)
            setMetadata(resMetadat)
        }
        collectData()
    }, [data, formData, templateData])

    useEffect(() => {
        handleGetTemplate(
            (data) => setTemplateData(data),
            (message) => errorFallback("Gagal Mengambil Templat", message)
        )
    }, [errorFallback])

    if (!formData || !metadata) return
    return (
        <div
            className={cn(
                className,
                "max-w-200 max-h-150 p-5 gap-2",
                "flex flex-col items-start justify-start",
                "bg-indigo-50 rounded-lg overflow-hidden"
            )}
            {...props}
        >
            <span className="px-5 py-3 w-full h-fit bg-indigo-200">
                <h4 className="max-w-full truncate font-semibold">Pratinjau Dokumen</h4>
            </span>
            <span
                className={cn(
                    "w-full flex-1 gap-2",
                    "flex items-center justify-center",
                    "rounded-md overflow-hidden bg-indigo-100"
                )}
            >
                <SPTJBPreview
                    ref={ref}
                    className="w-full md:flex-1 h-full"
                    formData={formData}
                    template={templateData}
                    metadata={metadata}
                    data={data}
                />
            </span>
            <span
                className={cn(
                    "w-full h-fit gap-4",
                    "flex items-center justify-between",
                    "bg-indigo-100 rounded-md overflow-hidden"
                )}
            >
                <Button
                    onClick={() => onClose && onClose()}
                    className="aspect-square h-8 w-fit text-sm"
                >
                    <X className="shrink-0 size-4 text-white" />
                </Button>
                <span
                    className={cn(
                        "w-fit h-fit gap-2",
                        "flex items-start justify-start",
                        "overflow-hidden"
                    )}
                >
                    <Button
                        onClick={() => onOpen && onOpen()}
                        className="aspect-square h-8 w-fit text-sm"
                    >
                        <PenBox className="shrink-0 size-4 text-white" />
                    </Button>
                    <Button
                        onClick={() => onPrint && onPrint()}
                        className="aspect-square h-8 w-fit text-sm"
                    >
                        <Printer className="shrink-0 size-4 text-white" />
                    </Button>
                </span>
            </span>
        </div>
    )
})
