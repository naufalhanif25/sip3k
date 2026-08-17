import * as z from "zod"

export const UserLogin = z.object({
    username: z.string(),
    password: z.string(),
    isRemember: z.boolean(),
})

export type UserLoginProps = z.infer<typeof UserLogin>
