import fs from "fs"
import path from "path"
import * as bcrypt from "bcrypt-ts"
import rawenv from "@/../../data/rawenv.json"

const setEnvVariable = (key: string, value: string, filePath: string = ".env") => {
    const envFilePath = path.join(process.cwd(), filePath)

    if (!fs.existsSync(envFilePath)) {
        console.error(`File ${filePath} tidak ditemukan.`)
        return
    }
    let envContent = fs.readFileSync(envFilePath, "utf-8")
    const keyRegex = new RegExp(`^${key}=.*$`, "m")
    if (keyRegex.test(envContent)) {
        envContent = envContent.replace(keyRegex, `${key}=${value}`)
    } else {
        const newline = envContent.endsWith("\n") || envContent === "" ? "" : "\n"
        envContent += `${newline}${key}=${value}\n`
    }
    fs.writeFileSync(filePath, envContent, "utf-8")
}

const envFilesPath: (".env.local" | ".env")[] = [".env.local", ".env"]

for (const file of envFilesPath) {
    const envConfig = {
        ADMIN_USERNAME: rawenv["ADMIN_USERNAME"],
        ADMIN_PASSWORD: (() => {
            const rawPassword = rawenv["ADMIN_PASSWORD"]
            const hashedPassword = bcrypt.hashSync(rawPassword)

            if (file === ".env.local") {
                return hashedPassword.replaceAll("$", "\\$")
            } else {
                return hashedPassword
            }
        })(),
        COOKIE_SECURE: rawenv["COOKIE_SECURE"],
        JWT_SECRET: rawenv["JWT_SECRET"],
        WA_API_TOKEN: rawenv["WA_API_TOKEN"],
    }
    for (const [key, value] of Object.entries(envConfig)) {
        if (!value) continue
        setEnvVariable(key, value, file)
    }
}
