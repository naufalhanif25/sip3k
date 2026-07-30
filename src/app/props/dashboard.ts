import * as z from "zod"
import { HTMLAttributes, ReactNode } from "react"

export type DashboardProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode
}

export interface DashboardSidebarButtonProps extends HTMLAttributes<HTMLSpanElement> {
    title: string
    color: string
    icon: ReactNode
}

export interface PreviewBoxProps extends HTMLAttributes<HTMLSpanElement> {
    data: {
        name: string
        icon: string
        color: string
    }[]
    title: string
    description: string
}

export interface DashboardSubPageProps {
    title: string
    description: string
}

export const DashboardSubPage = z.object({
    title: z.string(),
    description: z.string(),
})

export interface RoundButtonProps extends HTMLAttributes<HTMLSpanElement> {
    icon: ReactNode
}
