"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/app/lib/cn"
import { Plus } from "lucide-react"
import Dashboard from "@/app/components/dashboard/dashboard"
import { DashboardSubPage } from "@/app/props/dashboard"
import * as Table from "@/app/components/table"
import PicketBox from "@/app/components/dashboard/picket-box"
import variables from "../../data/variables.json"
import Button from "@/app/components/button"

export default function Picket() {
    const path = usePathname()
    const target = variables.paths.find((data) => data.route === path)
    const subPageData = DashboardSubPage.parse({
        title: target?.name ?? path.replace(/\b\w/g, (char) => char.toUpperCase()),
        description: target?.description ?? path.replace(/\b\w/g, (char) => char.toUpperCase()),
    })

    return (
        <Dashboard
            className={cn(
                "w-dvw h-dvh",
                "flex flex-col items-start justify-center",
                "overflow-hidden"
            )}
        >
            <div
                className={cn("flex flex-col items-start justify-start", "p-4 gap-1 w-full h-full")}
            >
                <div
                    className={cn(
                        "w-full h-fit py-2 px-4",
                        "flex flex-col",
                        "bg-indigo-100 border-b-2 border-indigo-300"
                    )}
                >
                    <h2 className="text-lg font-semibold w-full truncate">{subPageData.title}</h2>
                    <h4 className="text-xs w-full line-clamp-2">{subPageData.description}</h4>
                </div>
                <div
                    className={cn(
                        "flex flex-col items-center justify-start",
                        "w-full flex-1 overflow-y-auto gap-2"
                    )}
                >
                    <div className={cn("flex flex-col items-center justify-start", "w-full h-fit")}>
                        <span className={cn("w-full h-fit px-1 py-2")}>
                            <h2 className="font-semibold text-md truncate text-nowrap max-w-full">
                                Piket Hari Ini
                            </h2>
                        </span>
                        <span
                            className={cn(
                                "w-full h-fit gap-2",
                                "grid grid-cols-1 sm:grid-cols-2 grid-rows-2 sm:grid-rows-1"
                            )}
                        >
                            <PicketBox
                                className="w-full h-fit p-4"
                                name="John Doe"
                                nip="19990101 200001 1 001"
                                lastRemind="03:00 WIB"
                                onDone={() => {}}
                                onRemind={() => {}}
                            />
                            <PicketBox
                                className="w-full h-fit p-4"
                                name="John Doe"
                                nip="19990101 200001 1 001"
                                lastRemind="03:00 WIB"
                                onDone={() => {}}
                                onRemind={() => {}}
                            />
                        </span>
                    </div>
                    <div className={cn("flex flex-col items-center justify-start", "w-full h-fit")}>
                        <span
                            className={cn(
                                "w-full h-fit px-1 py-2",
                                "flex items-center justify-between"
                            )}
                        >
                            <h2 className="font-semibold text-md truncate text-nowrap max-w-full">
                                Daftar Pegawai
                            </h2>
                            <Button className="h-7 aspect-square w-fit text-sm">
                                <Plus className="size-4 shrink-0" />
                            </Button>
                        </span>
                        <span className="w-full max-w-full h-fit overflow-x-auto">
                            <Table.Table className="w-full max-w-full h-fit">
                                <Table.TableHeader names={["No.", "Nama", "NIP", "No. HP"]} />
                                <Table.TableBody>
                                    <Table.TableRow>
                                        <Table.TableCell className="text-center">
                                            1.
                                        </Table.TableCell>
                                        <Table.TableCell>Naufal Hanif</Table.TableCell>
                                        <Table.TableCell>2308107010025</Table.TableCell>
                                        <Table.TableCell>081212345678</Table.TableCell>
                                    </Table.TableRow>
                                    <Table.TableRow>
                                        <Table.TableCell className="text-center">
                                            2.
                                        </Table.TableCell>
                                        <Table.TableCell>Naufal Hanif</Table.TableCell>
                                        <Table.TableCell>2308107010025</Table.TableCell>
                                        <Table.TableCell>081212345678</Table.TableCell>
                                    </Table.TableRow>
                                    <Table.TableRow>
                                        <Table.TableCell className="text-center">
                                            3.
                                        </Table.TableCell>
                                        <Table.TableCell>Naufal Hanif</Table.TableCell>
                                        <Table.TableCell>2308107010025</Table.TableCell>
                                        <Table.TableCell>081212345678</Table.TableCell>
                                    </Table.TableRow>
                                </Table.TableBody>
                            </Table.Table>
                        </span>
                    </div>
                </div>
            </div>
        </Dashboard>
    )
}
