"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import variables from "@/app/data/variables.json"

export default function Dashboard() {
    const router = useRouter()

    useEffect(() => {
        router.replace(variables.paths[0].route)
    }, [router])

    return null
}
