import { NextRequest, NextResponse } from "next/server"
import variables from "@/app/data/variables.json"
import { verifyJWT } from "@/app/lib/global-utils"

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl
    const token = req.cookies.get("token")?.value
    const isValidToken = token ? await verifyJWT(token) : null

    if (!isValidToken) {
        if (pathname !== "/") {
            const loginUrl = new URL("/", req.url)
            const response = NextResponse.redirect(loginUrl)

            if (token) response.cookies.delete("token")
            return response
        }
        return NextResponse.next()
    }
    if (isValidToken) {
        if (pathname === "/" || pathname === "/dashboard") {
            return NextResponse.redirect(new URL(variables.routes[0].route, req.url))
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
}
