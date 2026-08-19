"use client"

import { cn } from "@/app/lib/global-utils"
import Button from "@/app/components/button"
import FormSection from "@/app/components/dashboard/sptjb/form-section"
import Input from "@/app/components/input"
import Dropdown from "@/app/components/dropdown"
import AdditionalForm from "@/app/components/dashboard/sptjb/additional-form"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import variables from "@/app/data/variables.json"
import { type FormSideProps } from "@/app/props/sptjb"
import { useBudgetClass } from "@/app/hooks/sptjb"

export default function FormSide({
    data,
    formData,
    formDataKey,
    onNameChange,
    onChoose,
    onClassChoose,
    onFormPrev,
    onFormNewNext,
    isLast,
    onFormDelete,
    onFormCodeChange,
    onFormNameChange,
    onFormDescChange,
    onFormDateChange,
    onFormIDChange,
    onFormTotalChange,
    onFormPPNChange,
    onFormPPhChange,
    className,
    ...props
}: FormSideProps) {
    const { budgetClass, classValue } = useBudgetClass(data.division, data._class, onClassChoose)

    return (
        <div
            className={cn(
                className,
                "bg-indigo-100 overflow-y-auto rounded-lg",
                "flex flex-col items-center justify-start gap-3"
            )}
            {...props}
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
                    <Dropdown
                        className="w-full shrink-0 h-fit gap-2"
                        title="Klasifikasi"
                        placeholder="Pilih Kode Klasifikasi"
                        active={Boolean(data.division)}
                        options={data.division ? budgetClass.sort() : []}
                        value={classValue}
                        onChoose={onClassChoose}
                    />
                </FormSection>
                <FormSection title="Data Tambahan" className="w-full h-fit gap-2">
                    <AdditionalForm
                        className="w-full h-fit p-4 gap-2"
                        data={formData[formDataKey]}
                        title={`Formulir ${formDataKey + 1}`}
                        onDelete={() => onFormDelete && onFormDelete(formDataKey)}
                        onCodeChange={(e) => onFormCodeChange && onFormCodeChange(e, formDataKey)}
                        onNameChange={(e) => onFormNameChange && onFormNameChange(e, formDataKey)}
                        onDescChange={(e) => onFormDescChange && onFormDescChange(e, formDataKey)}
                        onDateChange={(e) => onFormDateChange && onFormDateChange(e, formDataKey)}
                        onIDChange={(e) => onFormIDChange && onFormIDChange(e, formDataKey)}
                        onTotalChange={(e) =>
                            onFormTotalChange && onFormTotalChange(e, formDataKey)
                        }
                        onPPNChange={(e) => onFormPPNChange && onFormPPNChange(e, formDataKey)}
                        onPPhChange={(e) => onFormPPhChange && onFormPPhChange(e, formDataKey)}
                    />
                    <div
                        className={cn(
                            "w-full max-w-full h-fit rounded-md gap-2",
                            "flex items-center justify-end",
                            "overflow-hidden"
                        )}
                    >
                        <Button
                            disabled={formDataKey === 0}
                            onClick={() => onFormPrev && onFormPrev()}
                            className="h-10 aspect-square text-sm"
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
                                {formDataKey + 1} / {formData.length}
                            </p>
                        </span>
                        <Button
                            onClick={() => onFormNewNext && onFormNewNext()}
                            className="h-10 aspect-square text-sm"
                        >
                            {isLast ? (
                                <Plus className="size-4 shrink-0" />
                            ) : (
                                <ChevronRight className="size-4 shrink-0" />
                            )}
                        </Button>
                    </div>
                </FormSection>
            </div>
        </div>
    )
}
