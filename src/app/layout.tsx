import type { Metadata } from "next"
import { Roboto, Roboto_Mono } from "next/font/google"
import { ReactNode } from "react"
import "@/app/globals.css"
import variables from "@/app/data/variables.json"

const robotoSans = Roboto({
    variable: "--font-roboto-sans",
    subsets: ["latin"],
})

const robotoMono = Roboto_Mono({
    variable: "--font-roboto-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: variables.shortform,
    description: variables.description,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <html
            lang={variables.language}
            className={`${robotoSans.variable} ${robotoMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    )
}
