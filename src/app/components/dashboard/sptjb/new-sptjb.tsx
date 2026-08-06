"use client"

import { cn } from "@/app/lib/cn"
import Button from "../../button"
import { NewSPTJBProps, ParsedMergeProps } from "@/app/props/dashboard"
import { ArrowLeft, Save, Printer, Plus, Trash, ChevronLeft, ChevronRight } from "lucide-react"
import { ChangeEvent, useMemo, useState } from "react"
import Input from "../../input"
import Dropdown from "../../dropdown"
import variables from "../../../data/variables.json"
import FormSection from "./form-section"
import AdditionalForm from "./additional-form"
import { FormInputProps, FormInput } from "@/app/props/dashboard"
import { useEffect } from "react"
import { TemplateGetResponse, TemplateGetResponseProps } from "@/app/props/api"
import * as SPTJBHandler from "@/app/lib/sptjb-handler"
import { parseMergeRanges } from "@/app/lib/sptjb-handler"
import ExcelTable from "./excel-table"

export default function NewSPTJB({
    data,
    onBack,
    onDelete,
    onSave,
    onPrint,
    onChoose,
    onNameChange,
    className,
    ...props
}: NewSPTJBProps) {
    const formInputInit = FormInput.parse({
        code: "",
        name: "",
        description: "",
        date: new Date(),
        total: 0,
        ppn: 0,
        pph: 0,
    })
    const [formData, setFormData] = useState<FormInputProps[]>([formInputInit])
    const [formDataIndex, setFormDataIndex] = useState<number>(0)
    const [templateData, setTemplateData] = useState<TemplateGetResponseProps | null>(null)
    const isLastFormData = useMemo(() => {
        return formDataIndex === formData.length - 1
    }, [formData, formDataIndex])
    const handleAddNewForm = () =>
        SPTJBHandler.addNewFormHandler(
            setFormData,
            setFormDataIndex,
            formInputInit,
            formData.length
        )
    const handleFormPrev = () => SPTJBHandler.formPrevHandler(setFormDataIndex)
    const handleFormNext = () => SPTJBHandler.formNextHandler(setFormDataIndex, formData.length - 1)
    const handleCodeChange = (value: string, index: number) =>
        SPTJBHandler.codeChangeHandler(setFormData, value, index)
    const handleNameChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement,
            HTMLInputElement | HTMLTextAreaElement
        >,
        index: number
    ) => SPTJBHandler.nameChangeHandler(setFormData, e, index)
    const handleDescChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement,
            HTMLInputElement | HTMLTextAreaElement
        >,
        index: number
    ) => SPTJBHandler.descChangeHandler(setFormData, e, index)
    const handleDateChange = (date: Date, index: number) =>
        SPTJBHandler.dateChangeHandler(setFormData, date, index)
    const handleTotalChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>, index: number) =>
        SPTJBHandler.totalChangeHandler(setFormData, e, index)
    const handlePPNChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>, index: number) =>
        SPTJBHandler.PPNChangeHandler(setFormData, e, index)
    const handlePPhChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>, index: number) =>
        SPTJBHandler.PPhChangeHandler(setFormData, e, index)
    const handleDeleteForm = (index: number) =>
        SPTJBHandler.deleteFormHandler(
            setFormData,
            setFormDataIndex,
            formInputInit,
            index,
            formData.length - 1
        )
    const isTemplateDataChanged = useMemo(() => {
        return JSON.stringify(formData) !== JSON.stringify([formInputInit])
    }, [formData, formInputInit])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/template")
                const data = TemplateGetResponse.parse(await res.json())

                if (data.success) {
                    setTemplateData(data)
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])

    const parsedMerges = templateData?.data.merges
        ? parseMergeRanges(templateData?.data.merges)
        : { mergeMap: new Map(), hiddenCells: new Set() }

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
                        onClick={() => onBack!(isTemplateDataChanged)}
                        className="aspect-square h-8 w-fit text-sm"
                    >
                        <ArrowLeft className="size-4 shrink-0" />
                    </Button>
                </span>
                <span className={cn("w-fit h-fit gap-2", "flex items-center justify-center")}>
                    <Button
                        onClick={() => onDelete!(isTemplateDataChanged)}
                        className="aspect-square h-8 w-fit text-sm"
                    >
                        <Trash className="size-4 shrink-0" />
                    </Button>
                    <Button
                        onClick={() => onPrint!(isTemplateDataChanged)}
                        className="aspect-square h-8 w-fit text-sm"
                    >
                        <Printer className="size-4 shrink-0" />
                    </Button>
                    <Button
                        onClick={() => onSave!(isTemplateDataChanged)}
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
                <div
                    className={cn(
                        "w-full md:flex-1 h-full",
                        "bg-indigo-100 rounded-lg overflow-hidden",
                        "flex flex-col items-start justify-start"
                    )}
                >
                    <span
                        className={cn(
                            "w-full h-fit px-4 py-3",
                            "bg-indigo-400 text-white",
                            "flex flex-col items-start justify-start",
                            "overflow-hidden"
                        )}
                    >
                        <h4 className="text-sm truncate max-w-full">Pratinjau Dokumen</h4>
                        <p className="text-xs text-white/75">{data.name || "Dokumen Tanpa Nama"}</p>
                    </span>
                    <span
                        className={cn(
                            "w-full flex-1 overflow-auto overscroll-none",
                            "flex items-start justify-start"
                        )}
                    >
                        {templateData?.data ? (
                            <span
                                className={cn(
                                    "h-fit w-fit p-5",
                                    "flex items-start justify-start",
                                    "bg-white"
                                )}
                            >
                                <div className="w-fit h-fit">
                                    <ExcelTable
                                        className="w-min border border-gray-400"
                                        data={templateData}
                                        merges={parsedMerges as ParsedMergeProps}
                                    />
                                </div>
                            </span>
                        ) : (
                            <span
                                className={cn(
                                    "w-full h-full p-5",
                                    "flex items-center justify-center",
                                    "overflow-hidden"
                                )}
                            >
                                <h3 className="max-w-50 text-center text-black/50">
                                    Tidak ada dokumen untuk ditampilkan
                                </h3>
                            </span>
                        )}
                    </span>
                </div>
                <div
                    className={cn(
                        "w-full md:w-1/2 md:max-w-100 max-h-50 md:max-h-full h-full",
                        "bg-indigo-100 overflow-y-auto rounded-lg",
                        "flex flex-col items-center justify-start gap-3",
                        "px-5 pt-3 pb-4"
                    )}
                >
                    <div className={cn("w-full h-fit", "flex flex-col items-start justify-center")}>
                        <h5 className="truncate font-semibold max-w-full">Formulir Dokumen</h5>
                        <p className="line-clamp-2 text-xs max-w-full">
                            Ubah dan perbarui data pada dokumen melalui formulir
                        </p>
                    </div>
                    <div className={cn("w-full flex-1 gap-3", "flex flex-col")}>
                        <FormSection title="Data Master" className="w-full h-fit gap-2">
                            <Input
                                title="Nama Dokumen"
                                type="text"
                                value={data.name}
                                onChange={onNameChange}
                                className="w-full min-w-0 sm:flex-1 min-h-10 text-sm shrink-0"
                                placeholder="Nama Dokumen"
                            />
                            <Dropdown
                                className="w-full shrink-0 h-fit gap-2"
                                title="Bidang"
                                placeholder="Pilih Bidang"
                                options={variables.divisions.sort()}
                                value={data.division}
                                onChoose={onChoose}
                            />
                        </FormSection>
                        <FormSection title="Data Tambahan" className="w-full h-fit gap-2">
                            <AdditionalForm
                                className="w-full h-fit p-4 gap-2"
                                data={formData[formDataIndex]}
                                title={`Formulir ${formDataIndex + 1}`}
                                onDelete={() => handleDeleteForm(formDataIndex)}
                                onChoose={(value) => handleCodeChange(value, formDataIndex)}
                                onNameChange={(e) => handleNameChange(e, formDataIndex)}
                                onDescChange={(e) => handleDescChange(e, formDataIndex)}
                                onDateChange={(e) => handleDateChange(e, formDataIndex)}
                                onTotalChange={(e) => handleTotalChange(e, formDataIndex)}
                                onPPNChange={(e) => handlePPNChange(e, formDataIndex)}
                                onPPhChange={(e) => handlePPhChange(e, formDataIndex)}
                            />
                            <div
                                className={cn(
                                    "w-full max-w-full h-fit rounded-md gap-2",
                                    "flex items-center justify-end",
                                    "overflow-hidden"
                                )}
                            >
                                <Button
                                    disabled={formDataIndex === 0}
                                    onClick={handleFormPrev}
                                    className={cn(
                                        "h-10 aspect-square text-sm",
                                        "disabled:pointer-events-none disabled:select-none",
                                        "disabled:bg-indigo-300"
                                    )}
                                >
                                    <ChevronLeft className="size-4 shrink-0" />
                                </Button>
                                <span
                                    className={cn(
                                        "h-10 flex-1 p-2 flex items-center justify-center",
                                        "bg-indigo-200 rounded-md overflow-hidden"
                                    )}
                                >
                                    <p className="truncate max-w-full">
                                        {formDataIndex + 1} / {formData.length}
                                    </p>
                                </span>
                                <Button
                                    onClick={isLastFormData ? handleAddNewForm : handleFormNext}
                                    className="h-10 aspect-square text-sm"
                                >
                                    {isLastFormData ? (
                                        <Plus className="size-4 shrink-0" />
                                    ) : (
                                        <ChevronRight className="size-4 shrink-0" />
                                    )}
                                </Button>
                            </div>
                        </FormSection>
                    </div>
                </div>
            </div>
        </div>
    )
}
