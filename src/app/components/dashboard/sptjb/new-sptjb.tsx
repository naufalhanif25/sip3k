"use client"

import { cn } from "@/app/lib/cn"
import Button from "../../button"
import { NewSPTJBProps } from "@/app/props/dashboard"
import { ArrowLeft, Save, Printer, Plus, Trash } from "lucide-react"
import { ChangeEvent, useState } from "react"
import Input from "../../input"
import Dropdown from "../../dropdown"
import variables from "../../../data/variables.json"
import FormSection from "./form-section"
import AdditionalForm from "./additional-form"
import { FormInputProps, FormInput } from "@/app/props/dashboard"

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
    const [formData, setFormData] = useState<FormInputProps[]>([
        FormInput.parse({
            code: "",
            name: "",
            description: "",
            date: new Date(),
            total: 0,
        }),
    ])

    const handleAddNewForm = () => {
        setFormData((prev) => [
            ...prev,
            FormInput.parse({
                code: "",
                name: "",
                description: "",
                date: new Date(),
                total: 0,
            }),
        ])
    }

    const handleCodeChange = (value: string, index: number) =>
        setFormData((prev) =>
            prev.map((item, idx) => (idx === index ? { ...item, code: value } : item))
        )

    const handleNameChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement,
            HTMLInputElement | HTMLTextAreaElement
        >,
        index: number
    ) =>
        setFormData((prev) =>
            prev.map((item, idx) => (idx === index ? { ...item, name: e.target.value } : item))
        )

    const handleDescChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement,
            HTMLInputElement | HTMLTextAreaElement
        >,
        index: number
    ) =>
        setFormData((prev) =>
            prev.map((item, idx) =>
                idx === index ? { ...item, description: e.target.value } : item
            )
        )

    const handleDateChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>, index: number) =>
        setFormData((prev) =>
            prev.map((item, idx) =>
                idx === index ? { ...item, date: e.target.valueAsDate! } : item
            )
        )

    const handleTotalChange = (
        e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
        index: number
    ) => {
        let value = e.target.value
        value = value.replace(/\D/g, "")
        value = value.replace(/^0+(?=\d)/, "")

        setFormData((prev) =>
            prev.map((item, idx) =>
                idx === index ? { ...item, total: value === "" ? 0 : Number(value) } : item
            )
        )
    }

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
                    <Button onClick={onBack} className="aspect-square h-8 w-fit text-sm">
                        <ArrowLeft className="size-4 shrink-0" />
                    </Button>
                </span>
                <span className={cn("w-fit h-fit gap-2", "flex items-center justify-center")}>
                    <Button onClick={onDelete} className="aspect-square h-8 w-fit text-sm">
                        <Trash className="size-4 shrink-0" />
                    </Button>
                    <Button onClick={onPrint} className="aspect-square h-8 w-fit text-sm">
                        <Printer className="size-4 shrink-0" />
                    </Button>
                    <Button onClick={onSave} className="aspect-square h-8 w-fit text-sm">
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
                        "relative"
                    )}
                >
                    <span
                        className={cn(
                            "w-full h-fit gap-2 px-4 py-3",
                            "absolute top-0 left-0",
                            "bg-indigo-400 text-white",
                            "overflow-hidden"
                        )}
                    >
                        <h4 className="text-sm truncate max-w-full">Pratinjau Dokumen</h4>
                        <p className="text-xs text-white/75">{data.name || "Dokumen Tanpa Nama"}</p>
                    </span>
                    <span className="w-full h-full overflow-auto">
                        {/* TODO: Preview Dokumen */}
                    </span>
                </div>
                <div
                    className={cn(
                        "w-full md:w-1/2 md:max-w-80 max-h-50 md:max-h-full h-full",
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
                            {formData.map((data, index) => {
                                return (
                                    <AdditionalForm
                                        key={index}
                                        className="w-full h-fit p-4 gap-2"
                                        data={data}
                                        title={`Formulir ${index + 1}`}
                                        onChoose={(value) => handleCodeChange(value, index)}
                                        onNameChange={(e) => handleNameChange(e, index)}
                                        onDescChange={(e) => handleDescChange(e, index)}
                                        onDateChange={(e) => handleDateChange(e, index)}
                                        onTotalChange={(e) => handleTotalChange(e, index)}
                                    />
                                )
                            })}
                            <div
                                className={cn(
                                    "w-full h-fit rounded-md",
                                    "flex items-center justify-end"
                                )}
                            >
                                <Button
                                    onClick={handleAddNewForm}
                                    className="py-1 px-5 h-10 w-full text-sm"
                                >
                                    <Plus className="size-4 shrink-0" />
                                    Tambah Formulir
                                </Button>
                            </div>
                        </FormSection>
                    </div>
                </div>
            </div>
        </div>
    )
}
