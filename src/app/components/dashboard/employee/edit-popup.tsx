"use client"

import { cn } from "@/app/lib/global-utils"
import Input from "@/app/components/input"
import Button from "@/app/components/button"
import Dropdown from "@/app/components/dropdown"
import { Save, X } from "lucide-react"
import { ChangeEvent } from "react"
import { useState } from "react"
import { type EmployeeDataProps } from "@/app/props/picket"
import EmployeeFormPopup from "@/app/components/dashboard/employee/form-popup"
import { type EmployeeEditPopupProps } from "@/app/props/picket"
import variables from "@/app/data/variables.json"
import * as PicketHandler from "@/app/lib/picket-handler"

export default function EmployeeEditPopup({
    data,
    onCencel,
    onSave,
    className,
    ...props
}: EmployeeEditPopupProps) {
    const [employeeData, setEmployeeData] = useState<EmployeeDataProps>(data)
    const onPositonChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        PicketHandler.handleChangePosition(setEmployeeData, event)
    }
    const onCategoryChange = (value: string) => {
        PicketHandler.handleChangeCategory(setEmployeeData, value)
    }
    const onRankChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        PicketHandler.handleChangeRank(setEmployeeData, event)
    }
    const onPhoneChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        PicketHandler.handleChangePhone(setEmployeeData, event)
    }

    return (
        <EmployeeFormPopup
            title="Perbarui Data Pegawai"
            className={className}
            body={
                <>
                    <Input
                        title="Jabatan"
                        onChange={onPositonChange}
                        value={employeeData?.position}
                        type="text"
                        placeholder="Jabatan"
                        className="w-full h-10 text-sm shrink-0"
                    />
                    <span className={cn("w-full h-fit gap-2", "grid grid-cols-2")}>
                        <Input
                            title="Pangkat"
                            onChange={onRankChange}
                            value={employeeData?.rank}
                            type="text"
                            placeholder="Pangkat"
                            className="w-full h-10 min-h-10 text-sm shrink-0"
                        />
                        <Dropdown
                            className="w-full h-fit gap-2 shrink-0"
                            title="Golongan"
                            placeholder="Pilih Golongan"
                            options={variables.category.sort()}
                            value={employeeData?.category}
                            onChoose={onCategoryChange}
                        />
                    </span>
                    <Input
                        title="No. HP"
                        onChange={onPhoneChange}
                        value={employeeData?.phone}
                        type="text"
                        placeholder="No. HP"
                        className="w-full h-10 text-sm shrink-0"
                    />
                </>
            }
            footer={
                <>
                    <Button
                        onClick={() => onCencel && onCencel(employeeData)}
                        className="h-10 flex-1 px-3 py-1 text-sm"
                    >
                        <X className="size-4 shrink-0" />
                        <p className="hidden xs:block">Batal</p>
                    </Button>
                    <Button
                        onClick={() => onSave && onSave(employeeData)}
                        className="h-10 flex-1 px-3 py-1 text-sm"
                    >
                        <Save className="size-4 shrink-0" />
                        <p className="hidden xs:block">Perbarui</p>
                    </Button>
                </>
            }
            {...props}
        />
    )
}
