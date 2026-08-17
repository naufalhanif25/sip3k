import { ChangeEvent, Dispatch, SetStateAction } from "react"
import { type UserLoginProps } from "@/app/props/user"

export const handleChangeUsername = (
    setter: Dispatch<SetStateAction<UserLoginProps>>,
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>
) => {
    setter((prev) => ({
        ...prev,
        username: event.target.value,
    }))
}

export const handleChangePassword = (
    setter: Dispatch<SetStateAction<UserLoginProps>>,
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>
) => {
    setter((prev) => ({
        ...prev,
        password: event.target.value,
    }))
}

export const handleChangeIsRemember = (setter: Dispatch<SetStateAction<UserLoginProps>>) => {
    setter((prev) => ({
        ...prev,
        isRemember: !prev.isRemember,
    }))
}
