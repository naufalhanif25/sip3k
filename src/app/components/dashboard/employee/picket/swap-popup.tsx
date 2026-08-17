"use client"

import { cn } from "@/app/lib/global-utils"
import EmployeeFormPopup from "@/app/components/dashboard/employee/form-popup"
import { useEffect, useState } from "react"
import Input from "@/app/components/input"
import Button from "@/app/components/button"
import { PicketSwapPopupProps } from "@/app/props/picket"
import { handleChangeIDValue, handleAutoRename } from "@/app/lib/picket-handler"
import { Save, X } from "lucide-react"

export default function PicketSwapPopup({
    employees,
    data,
    onCencel,
    onSave,
    className,
    ...props
}: PicketSwapPopupProps) {
    const [firstEmployee, setFirstEmployee] = useState(data.employees.first)
    const [secondEmployee, setSecondEmployee] = useState(data.employees.second)

    useEffect(() => {
        const timer = setTimeout(() => {
            handleAutoRename(setFirstEmployee, employees, firstEmployee.employeeId)
        }, 500)
        return () => clearTimeout(timer)
    }, [firstEmployee.employeeId, employees])
    useEffect(() => {
        const timer = setTimeout(() => {
            handleAutoRename(setSecondEmployee, employees, secondEmployee.employeeId)
        }, 500)
        return () => clearTimeout(timer)
    }, [secondEmployee.employeeId, employees])

    const handleSetFirstID = (id: string) => {
        handleChangeIDValue(setFirstEmployee, id)
    }
    const handleSetSecondID = (id: string) => {
        handleChangeIDValue(setSecondEmployee, id)
    }

    return (
        <EmployeeFormPopup
            title="Ganti Pegawai"
            className={className}
            body={
                <>
                    <span className={cn("w-full h-fit gap-2", "grid grid-cols-2", "items-end")}>
                        <Input
                            title={`NIP (${firstEmployee.name || "Nama tidak ditemukan"})`}
                            onChange={(event) => handleSetFirstID(event.target.value)}
                            value={firstEmployee.employeeId}
                            type="text"
                            placeholder={`NIP (${firstEmployee.name || "Nama tidak ditemukan"})`}
                            className="w-full h-10 min-h-10 text-sm shrink-0"
                        />
                        <span
                            className={cn(
                                "w-full h-10 px-3 py-1",
                                "flex items-center justify-start",
                                "bg-indigo-100 rounded-md",
                                "overflow-hidden"
                            )}
                        >
                            <h4 className="max-w-full truncate text-sm">{firstEmployee.name}</h4>
                        </span>
                    </span>
                    <span className={cn("w-full h-fit gap-2", "grid grid-cols-2", "items-end")}>
                        <Input
                            title={`NIP (${secondEmployee.name || "Nama tidak ditemukan"})`}
                            onChange={(event) => handleSetSecondID(event.target.value)}
                            value={secondEmployee.employeeId}
                            type="text"
                            placeholder={`NIP (${secondEmployee.name || "Nama tidak ditemukan"})`}
                            className="w-full h-10 min-h-10 text-sm shrink-0"
                        />
                        <span
                            className={cn(
                                "w-full h-10 px-3 py-1",
                                "flex items-center justify-start",
                                "bg-indigo-100 rounded-md",
                                "overflow-hidden"
                            )}
                        >
                            <h4 className="max-w-full truncate text-sm">{secondEmployee.name}</h4>
                        </span>
                    </span>
                </>
            }
            footer={
                <>
                    <Button
                        onClick={() =>
                            onCencel &&
                            onCencel({
                                ...data,
                                employees: { first: firstEmployee, second: secondEmployee },
                            })
                        }
                        className="h-10 flex-1 px-3 py-1 text-sm"
                    >
                        <X className="size-4 shrink-0" />
                        <p className="hidden xs:block">Batal</p>
                    </Button>
                    <Button
                        onClick={() =>
                            onSave &&
                            onSave({
                                ...data,
                                employees: { first: firstEmployee, second: secondEmployee },
                            })
                        }
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
