import {
    BasicAPIResponse,
    EmployeeGetResponse,
    PicketGetResponse,
    TodatPicketGetResponse,
} from "@/app/props/api"
import {
    type PicketProps,
    type EmployeeBasicProps,
    type EmployeeProps,
    EmployeePicketProps,
    EmployeePicketDataProps,
} from "@/app/props/db"
import { fetchData } from "@/app/lib/global-utils"
import { type EmployeeDataProps } from "@/app/props/picket"

export const handleGetTodayPicket = async (
    onSuccess: (message: string, data: EmployeePicketProps | null) => void,
    onError: (message: string) => void
) => {
    await fetchData(
        "/api/employee/picket/today",
        {
            headers: {
                "Content-Type": "application/json",
            },
        },
        (res) => {
            const data = TodatPicketGetResponse.parse(res)

            if (data.success) onSuccess(data.message, data.data || null)
            else onError(data.message)
        }
    )
}

export const handleSendNotification = async (
    data: EmployeePicketDataProps,
    date: Date,
    onSuccess: (message: string) => void,
    onError: (message: string) => void
) => {
    await fetchData(
        "/api/employee/notif",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data,
                date,
            }),
        },
        (res) => {
            const data = BasicAPIResponse.parse(res)

            if (data.success) onSuccess(data.message)
            else onError(data.message)
        }
    )
}

export const handleGetPicketData = async (
    onSuccess: (message: string, data: PicketProps) => void,
    onError: (message: string) => void
) => {
    await fetchData(
        "/api/employee/picket",
        {
            headers: {
                "Content-Type": "application/json",
            },
        },
        (res) => {
            const data = PicketGetResponse.parse(res)
            const picketData = data.data as PicketProps

            if (data.success) onSuccess(data.message, picketData)
            else onError(data.message)
        }
    )
}

export const handleGeneratePicketData = async (
    onSuccess: (message: string) => void,
    onError: (message: string) => void
) => {
    await fetchData(
        "/api/employee/picket",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        },
        (res) => {
            const data = BasicAPIResponse.parse(res)

            if (data.success) onSuccess(data.message)
            else onError(data.message)
        }
    )
}

export const handleSwapPicketData = async (
    id: string,
    picket: EmployeePicketProps,
    onSuccess: (message: string) => void,
    onError: (message: string) => void
) => {
    await fetchData(
        `/api/employee/picket?id=${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(picket),
        },
        (res) => {
            const data = BasicAPIResponse.parse(res)

            if (data.success) onSuccess(data.message)
            else onError(data.message)
        }
    )
}

export const handleGetEmployeeData = async (
    onSuccess: (message: string, data: EmployeeBasicProps[]) => void,
    onError: (message: string) => void
) => {
    await fetchData(
        "/api/employee",
        {
            headers: {
                "Content-Type": "application/json",
            },
        },
        (res) => {
            const data = EmployeeGetResponse.parse(res)
            const employeeData = data.data as EmployeeProps[]

            if (data.success) onSuccess(data.message, employeeData)
            else onError(data.message)
        }
    )
}

export const handleEditEmployee = async (
    data: EmployeeDataProps,
    onSuccess: (message: string) => void,
    onError: (message: string) => void
) => {
    await fetchData(
        "/api/employee",
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        },
        (res) => {
            const data = BasicAPIResponse.parse(res)

            if (data.success) onSuccess(data.message)
            else onError(data.message)
        }
    )
}

export const handleAddNewEmployee = async (
    data: EmployeeDataProps,
    onSuccess: (message: string) => void,
    onError: (message: string) => void
) => {
    await fetchData(
        "/api/employee",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        },
        (res) => {
            const data = BasicAPIResponse.parse(res)

            if (data.success) onSuccess(data.message)
            else onError(data.message)
        }
    )
}

export const handleDeleteEmployee = async (
    id: string,
    onSuccess: (message: string) => void,
    onError: (message: string) => void
) => {
    await fetchData(
        `/api/employee?id=${id}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        },
        (res) => {
            const data = BasicAPIResponse.parse(res)

            if (data.success) onSuccess(data.message)
            else onError(data.message)
        }
    )
}
