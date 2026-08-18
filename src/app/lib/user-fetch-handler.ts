import {
    BasicAPIResponse,
    UserLoginAPIResponse,
    type UserLoginAPIResponseProps,
} from "@/app/props/api"
import { type UserLoginProps } from "@/app/props/user"
import { fetchData } from "@/app/lib/global-utils"

export const handleUserLogin = async (
    userData: UserLoginProps,
    onSuccess: (data: UserLoginAPIResponseProps) => void,
    onError: (message: string) => void,
    signal?: AbortSignal
) => {
    await fetchData(
        "/api/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
            signal,
        },
        (res) => {
            const data = UserLoginAPIResponse.parse(res)

            if (data.success) onSuccess(data)
            else onError(data.message)
        }
    )
}

export const handleUserLogout = async (
    onSuccess: (message: string) => void,
    onError: (message: string) => void,
    signal?: AbortSignal
) => {
    await fetchData(
        "/api/auth/logout",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            signal,
        },
        (res) => {
            const data = BasicAPIResponse.parse(res)

            if (data.success) onSuccess(data.message)
            else onError(data.message)
        }
    )
}
