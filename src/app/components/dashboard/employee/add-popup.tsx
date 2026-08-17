"use client"

import { cn } from "@/app/lib/global-utils"
import Input from "@/app/components/input"
import Button from "@/app/components/button"
import Dropdown from "@/app/components/dropdown"
import { Plus, X } from "lucide-react"
import { ChangeEvent } from "react"
import { useState } from "react"
import { type EmployeeDataProps, EmployeeGender } from "@/app/props/picket"
import EmployeeFormPopup from "@/app/components/dashboard/employee/form-popup"
import { type EmployeeAddPopupProps } from "@/app/props/picket"
import variables from "@/app/data/variables.json"
import { EMPLOYEE_DATA_DEFAULT } from "@/app/vars/global-vars"
import * as PicketHandler from "@/app/lib/picket-handler"

export default function EmployeeAddPopup({
    onCencel,
    onAddEmployee,
    className,
    ...props
}: EmployeeAddPopupProps) {
    const [employeeData, setEmployeeData] = useState<EmployeeDataProps>(EMPLOYEE_DATA_DEFAULT)
    const onNameChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        PicketHandler.handleChangeName(setEmployeeData, event)
    }
    const onPositonChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        PicketHandler.handleChangePosition(setEmployeeData, event)
    }
    const onCategoryChange = (value: string) => {
        PicketHandler.handleChangeCategory(setEmployeeData, value)
    }
    const onRankChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        PicketHandler.handleChangeRank(setEmployeeData, event)
    }
    const onIDChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        PicketHandler.handleChangeID(setEmployeeData, event)
    }
    const onPhoneChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        PicketHandler.handleChangePhone(setEmployeeData, event)
    }
    const onGenderChange = (value: string) => {
        PicketHandler.handleChangeGender(setEmployeeData, value)
    }

    return (
        <EmployeeFormPopup
            title="Tambah Pegawai"
            className={className}
            body={
                <>
                    <span className={cn("w-full h-fit gap-2", "flex items-start justify-start")}>
                        <Input
                            title="Nama Pegawai"
                            onChange={onNameChange}
                            value={employeeData?.name}
                            type="text"
                            placeholder="Nama Pegawai"
                            className="flex-1 h-10 min-h-10 text-sm"
                        />
                        <Dropdown
                            className="w-1/3 h-fit gap-2 shrink-0"
                            title="Jenis Kelamin"
                            placeholder="Pilih Jenis Kelamin"
                            options={variables.gender}
                            value={(() => {
                                if (
                                    employeeData?.gender &&
                                    employeeData?.gender in variables.gendermap
                                ) {
                                    return variables.gender[
                                        variables.gendermap[employeeData.gender as EmployeeGender]
                                    ]
                                } else return null
                            })()}
                            onChoose={onGenderChange}
                        />
                    </span>
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
                        title="NIP"
                        onChange={onIDChange}
                        value={employeeData?.employeeId}
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
                        onClick={() => onAddEmployee && onAddEmployee(employeeData)}
                        className="h-10 flex-1 px-3 py-1 text-sm"
                    >
                        <Plus className="size-4 shrink-0" />
                        <p className="hidden xs:block">Tambah</p>
                    </Button>
                </>
            }
            {...props}
        />
    )
}
