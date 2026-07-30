import * as z from "zod"

export interface UserLoginProps {
    username: string
    password: string
    isRemember: boolean
}

export const UserLogin = z.object({
    username: z.string(),
    password: z.string(),
    isRemember: z.boolean(),
})
