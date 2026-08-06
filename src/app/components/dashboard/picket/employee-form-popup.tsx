"use client"

import { cn } from "@/app/lib/cn"
import Input from "../../input"
import Button from "../../button"
import Dropdown from "../../dropdown"
import { Plus, X } from "lucide-react"
import { ChangeEvent } from "react"
import { useState } from "react"
import { EmployeeDataProps, EmployeeData, EmployeeCategory } from "@/app/props/dashboard"
import { EmployeeFormPopupProps } from "@/app/props/dashboard"
import variables from "../../../data/variables.json"

export default function EmployeeFormPopup({
    onCencel,
    onAddEmployee,
    className,
    ...props
}: EmployeeFormPopupProps) {
    const [employeeData, setEmployeeData] = useState<EmployeeDataProps>(
        EmployeeData.parse({
            name: "",
            category: null,
            nip: "",
            phone: "",
        })
    )

    const onNameChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setEmployeeData((prev) => ({
            ...prev,
            name: e.target.value,
        }))
    }

    const onCategoryChange = (value: string) => {
        setEmployeeData((prev) => ({
            ...prev,
            category: value as EmployeeCategory,
        }))
    }

    const onNIPChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setEmployeeData((prev) => ({
            ...prev,
            nip: e.target.value,
        }))
    }

    const onPhoneChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setEmployeeData((prev) => ({
            ...prev,
            phone: e.target.value,
        }))
    }

    return (
        <div
            className={cn(
                className,
                "flex flex-col items-start justify-start",
                "rounded-lg bg-indigo-50"
            )}
            {...props}
        >
            <span className={cn("px-5 py-3 w-full h-fit", "bg-indigo-200")}>
                <h3 className="font-semibold max-w-full truncate">Tambah Pegawai</h3>
            </span>
            <span className={cn("w-full flex-1 gap-2", "flex flex-col items-start justify-start")}>
                <Input
                    title="Nama Pegawai"
                    onChange={onNameChange}
                    value={employeeData?.name}
                    type="text"
                    placeholder="Nama Pegawai"
                    className="w-full h-10 text-sm shrink-0"
                />
                <Dropdown
                    className="w-full shrink-0 h-fit gap-2"
                    title="Golongan"
                    placeholder="Pilih Golongan"
                    options={variables.category.sort()}
                    value={employeeData?.category}
                    onChoose={onCategoryChange}
                />
                <Input
                    title="NIP"
                    onChange={onNIPChange}
                    value={employeeData?.nip}
                    type="text"
                    placeholder="NIP"
                    className="w-full h-10 text-sm shrink-0"
                />
                <Input
                    title="No. HP"
                    onChange={onPhoneChange}
                    value={employeeData?.phone}
                    type="text"
                    placeholder="No. HP"
                    className="w-full h-10 text-sm shrink-0"
                />
            </span>
            <span
                className={cn(
                    "w-full h-fit gap-2",
                    "flex items-center justify-start",
                    "overflow-hidden"
                )}
            >
                <Button onClick={onCencel} className="h-10 flex-1 px-3 py-1 text-sm">
                    <X className="size-4 shrink-0" />
                    <p className="hidden xs:block">Batal</p>
                </Button>
                <Button onClick={onAddEmployee} className="h-10 flex-1 px-3 py-1 text-sm">
                    <Plus className="size-4 shrink-0" />
                    <p className="hidden xs:block">Tambah</p>
                </Button>
            </span>
        </div>
    )
}
