"use client"

import { cn } from "@/app/lib/global-utils"
import Button from "@/app/components/button"
import { DocumentInitProps, type NewSPTJBProps } from "@/app/props/sptjb"
import { ArrowLeft, Save, Printer, Trash } from "lucide-react"
import { ChangeEvent, forwardRef, useMemo, useRef, useState } from "react"
import { type FormInputProps } from "@/app/props/sptjb"
import { useEffect } from "react"
import { type TemplateGetResponseProps } from "@/app/props/api"
import * as SPTJBUtilsHandler from "@/app/lib/sptjb-utils-handler"
import FormSide from "@/app/components/dashboard/sptjb/form-side"
import { SPTJBPreview } from "@/app/components/dashboard/sptjb/sptjb-preview"
import { handleGetTemplate } from "@/app/lib/sptjb-fetch-handler"
import { FORM_INPUT_DEFAULT } from "@/app/vars/global-vars"
import { getMetadata } from "@/app/lib/sptjb-main-handle"

export const NewSPTJB = forwardRef<HTMLDivElement, NewSPTJBProps>(function NewSPTJB(
    {
        data,
        parentForm,
        onBack,
        onDelete,
        onSave,
        onPrint,
        onChoose,
        onClassChoose,
        onNameChange,
        setDocId,
        errorFallback,
        className,
        ...props
    },
    ref
) {
    const dataRef = useRef<DocumentInitProps>(data)
    const [formData, setFormData] = useState<FormInputProps[]>(parentForm ?? [FORM_INPUT_DEFAULT])
    const [formDataIndex, setFormDataIndex] = useState<number>(0)
    const [templateData, setTemplateData] = useState<TemplateGetResponseProps | null>(null)
    const metadata = useMemo(() => {
        const resMetadata = getMetadata(data, formData, templateData)
        return resMetadata
    }, [data, formData, templateData])

    useEffect(() => {
        if (!data.docId && metadata.docId && setDocId) setDocId(metadata.docId as string)
    }, [data.docId, metadata.docId, setDocId])

    const isLastFormData = useMemo(() => {
        return formDataIndex === formData.length - 1
    }, [formData, formDataIndex])
    const handleAddNewForm = () => {
        SPTJBUtilsHandler.addNewFormHandler(
            setFormData,
            setFormDataIndex,
            FORM_INPUT_DEFAULT,
            formData.length
        )
    }
    const handleFormPrev = () => {
        SPTJBUtilsHandler.formPrevHandler(setFormDataIndex)
    }
    const handleFormNext = () => {
        SPTJBUtilsHandler.formNextHandler(setFormDataIndex, formData.length - 1)
    }
    const handleCodeChange = (
        event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
        index: number
    ) => {
        SPTJBUtilsHandler.codeChangeHandler(setFormData, event, index)
    }
    const handleNameChange = (
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement,
            HTMLInputElement | HTMLTextAreaElement
        >,
        index: number
    ) => {
        SPTJBUtilsHandler.nameChangeHandler(setFormData, event, index)
    }
    const handleDescChange = (
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement,
            HTMLInputElement | HTMLTextAreaElement
        >,
        index: number
    ) => {
        SPTJBUtilsHandler.descChangeHandler(setFormData, event, index)
    }
    const handleDateChange = (date: Date, index: number) => {
        SPTJBUtilsHandler.dateChangeHandler(setFormData, date, index)
    }
    const handleIDChange = (
        event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
        index: number
    ) => {
        SPTJBUtilsHandler.idChangeHandler(setFormData, event, index)
    }
    const handleTotalChange = (
        event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
        index: number
    ) => {
        SPTJBUtilsHandler.totalChangeHandler(setFormData, event, index)
    }
    const handlePPNChange = (
        event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
        index: number
    ) => {
        SPTJBUtilsHandler.PPNChangeHandler(setFormData, event, index)
    }
    const handlePPhChange = (
        event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
        index: number
    ) => {
        SPTJBUtilsHandler.PPhChangeHandler(setFormData, event, index)
    }
    const handleDeleteForm = (index: number) => {
        SPTJBUtilsHandler.deleteFormHandler(
            setFormData,
            setFormDataIndex,
            FORM_INPUT_DEFAULT,
            index,
            formData.length - 1
        )
    }
    const handleSaveDocument = () => {
        if (onSave) onSave(formData, (id) => (dataRef.current = { ...data, id }))
    }
    const isTemplateDataChanged = useMemo(() => {
        return (
            JSON.stringify(formData) !== JSON.stringify(parentForm ?? [FORM_INPUT_DEFAULT]) ||
            JSON.stringify(dataRef.current) !== JSON.stringify(data)
        )
    }, [formData, parentForm, data])

    useEffect(() => {
        const controller = new AbortController()
        const { signal } = controller

        handleGetTemplate(
            (resData) => setTemplateData(resData),
            (message) => errorFallback("Gagal Mengambil Templat", message),
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
                    "w-full h-fit gap-2",
                    "flex items-start justify-between",
                    "bg-indigo-100 rounded-md",
                    "overflow-x-auto"
                )}
            >
                <span className={cn("w-fit h-fit gap-2", "flex items-center justify-center")}>
                    <Button
                        onClick={() => onBack && onBack(isTemplateDataChanged, formData)}
                        className="aspect-square h-8 w-fit text-sm"
                    >
                        <ArrowLeft className="size-4 shrink-0" />
                    </Button>
                </span>
                <span className={cn("w-fit h-fit gap-2", "flex items-center justify-center")}>
                    <Button
                        disabled={!data.id}
                        onClick={() => onDelete && onDelete()}
                        className={cn(
                            "aspect-square h-8 w-fit text-sm",
                            "disabled:pointer-events-none disabled:select-none",
                            "disabled:bg-indigo-300"
                        )}
                    >
                        <Trash className="size-4 shrink-0" />
                    </Button>
                    <Button
                        onClick={() => onPrint && onPrint()}
                        className="aspect-square h-8 w-fit text-sm"
                    >
                        <Printer className="size-4 shrink-0" />
                    </Button>
                    <Button
                        onClick={handleSaveDocument}
                        className="aspect-square h-8 w-fit text-sm"
                    >
                        <Save className="size-4 shrink-0" />
                    </Button>
                </span>
            </div>
            <div
                className={cn(
                    "w-full flex-1 gap-2 overflow-hidden",
                    "flex flex-col md:flex-row items-start justify-start"
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
                <FormSide
                    className={cn(
                        "w-full md:w-1/2 md:max-w-100 max-h-50 md:max-h-full h-full",
                        "px-5 pt-3 pb-4"
                    )}
                    data={data}
                    formData={formData}
                    formDataKey={formDataIndex}
                    onNameChange={onNameChange}
                    onChoose={onChoose}
                    onClassChoose={onClassChoose}
                    onFormPrev={handleFormPrev}
                    onFormNewNext={isLastFormData ? handleAddNewForm : handleFormNext}
                    isLast={isLastFormData}
                    onFormDelete={handleDeleteForm}
                    onFormCodeChange={handleCodeChange}
                    onFormNameChange={handleNameChange}
                    onFormDescChange={handleDescChange}
                    onFormDateChange={handleDateChange}
                    onFormIDChange={handleIDChange}
                    onFormTotalChange={handleTotalChange}
                    onFormPPNChange={handlePPNChange}
                    onFormPPhChange={handlePPhChange}
                />
            </div>
        </div>
    )
})
