import { Dispatch, SetStateAction, ChangeEvent } from "react"
import { EmployeeCategory, EmployeeData, type EmployeeDataProps } from "@/app/props/picket"
import { type EmployeeBasicProps, type EmployeePicketDataProps } from "@/app/props/db"

export const handleChangeName = (
    setter: Dispatch<SetStateAction<EmployeeDataProps>>,
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>
) => {
    setter((prev) => ({
        ...prev,
        name: event.target.value,
    }))
}

export const handleChangePosition = (
    setter: Dispatch<SetStateAction<EmployeeDataProps>>,
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>
) => {
    setter((prev) => ({
        ...prev,
        position: event.target.value,
    }))
}

export const handleChangeCategory = (
    setter: Dispatch<SetStateAction<EmployeeDataProps>>,
    value: string
) => {
    setter((prev) => ({
        ...prev,
        category: value as EmployeeCategory,
    }))
}

export const handleChangeRank = (
    setter: Dispatch<SetStateAction<EmployeeDataProps>>,
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>
) => {
    setter((prev) => ({
        ...prev,
        rank: event.target.value,
    }))
}

export const handleChangeID = (
    setter: Dispatch<SetStateAction<EmployeeDataProps>>,
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>
) => {
    setter((prev) => ({
        ...prev,
        employeeId: event.target.value,
    }))
}

export const handleChangePhone = (
    setter: Dispatch<SetStateAction<EmployeeDataProps>>,
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>
) => {
    setter((prev) => ({
        ...prev,
        phone: event.target.value,
    }))
}

export const handleChangeGender = (
    setter: Dispatch<SetStateAction<EmployeeDataProps>>,
    value: string
) => {
    setter((prev) => ({
        ...prev,
        gender: value[0] as "L" | "P",
    }))
}

export const handleEditEmployeeData = (
    data: EmployeeBasicProps,
    setter: Dispatch<SetStateAction<EmployeeDataProps | null>>
) => {
    setter(
        EmployeeData.parse({
            name: data.name,
            position: data.position,
            employeeId: data.employeeId,
            gender: data.gender,
            category: `${data.class}/${data.room}`,
            rank: data.rank,
            phone: data.phone,
        })
    )
}

export const handleChangeIDValue = (
    setter: Dispatch<SetStateAction<EmployeePicketDataProps>>,
    id: string
) => {
    setter((prev) => ({
        ...prev,
        employeeId: id,
    }))
}

export const handleAutoRename = (
    setter: Dispatch<SetStateAction<EmployeePicketDataProps>>,
    data: EmployeeBasicProps[] | null,
    id: string
) => {
    if (!data) return
    const found = data.find((emp) => emp.employeeId === id)
    setter((prev) => ({
        ...prev,
        name: found?.name || "",
    }))
}
