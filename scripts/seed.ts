import { JSONFilePreset } from "lowdb/node"
import { DATABASE_PATH } from "@/app/vars/global-vars"
import { DEFAULT_DATA } from "@/app/props/db"
import path from "path"

const db = await JSONFilePreset(path.resolve(process.cwd(), DATABASE_PATH), DEFAULT_DATA)

export async function resetDatabase() {
    db.data = structuredClone(DEFAULT_DATA)
    await db.write()
}

await resetDatabase()
