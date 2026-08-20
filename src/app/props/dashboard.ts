import * as z from "zod"
import { HTMLAttributes, ReactNode } from "react"
import { type UserDataProps } from "@/app/props/api"

export const PageRoute = z.object({
    name: z.string().default(""),
    icon: z.string().default(""),
    route: z.string().default(""),
    description: z.string().default(""),
})

export type PageRouteProps = z.infer<typeof PageRoute>

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

export const DashboardSubPage = z.object({
    title: z.string(),
    description: z.string(),
})

export type DashboardSubPageProps = z.infer<typeof DashboardSubPage>

export interface RoundButtonProps extends HTMLAttributes<HTMLSpanElement> {
    icon: ReactNode
}

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
    open: boolean
    path: string
    data: UserDataProps
    onPageChange?: (route: string) => void
    onLogOut?: () => void
    onClose?: () => void
}

export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
    title: string
    description: string
}