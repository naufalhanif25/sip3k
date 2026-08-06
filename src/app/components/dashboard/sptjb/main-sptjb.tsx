"use client"

import { cn } from "@/app/lib/cn"
import Input from "../../input"
import Dropdown from "../../dropdown"
import * as Table from "../../table"
import Button from "../../button"
import { PenBox, Plus, Printer, Trash } from "lucide-react"
import { MainSPTJBProps } from "@/app/props/dashboard"
import variables from "../../../data/variables.json"
import CheckBox from "../../checkbox"

export default function MainSPTJB({
    data,
    onNameChange,
    onChoose,
    onCreate,
    className,
    ...props
}: MainSPTJBProps) {
    return (
        <div className={className} {...props}>
            <div
                className={cn(
                    "w-full h-fit gap-4 rounded-lg p-4",
                    "flex flex-col items-center justify-start",
                    "bg-indigo-100"
                )}
            >
                <span
                    className={cn(
                        "w-full h-fit gap-2",
                        "flex flex-col sm:flex-row items-start justify-center"
                    )}
                >
                    <Input
                        title="Nama Dokumen"
                        type="text"
                        value={data.name}
                        onChange={onNameChange}
                        className="w-full min-w-0 sm:flex-1 min-h-10 text-sm shrink-0"
                        placeholder="Nama Dokumen"
                    />
                    <Dropdown
                        className="w-full min-w-0 sm:w-1/2 shrink-0 h-fit gap-2"
                        title="Bidang"
                        placeholder="Pilih Bidang"
                        options={variables.divisions.sort()}
                        value={data.division}
                        onChoose={onChoose}
                    />
                </span>
                <span className={cn("w-full h-fit gap-2", "flex items-start justify-start")}>
                    <Button onClick={onCreate} className="px-5 py-1 h-10 w-fit">
                        <Plus className="shrink-0 size-4 text-white" />
                        <p className="hidden xs:block">Buat Dokumen</p>
                    </Button>
                </span>
            </div>
            <div className={cn("w-full flex-1 flex flex-col", "overflow-auto")}>
                <Table.Table className="w-full h-fit">
                    <Table.TableHeader
                        names={[
                            "Pilih",
                            "Nama",
                            "Bidang",
                            "Dibuat pada",
                            "Diperbarui pada",
                            "Aksi",
                        ]}
                    />
                    <Table.TableBody>
                        <Table.TableRow className="text-center">
                            <Table.TableCell>
                                <CheckBox active={true} />
                            </Table.TableCell>
                            <Table.TableCell className="text-left">Dokumen SPTJB</Table.TableCell>
                            <Table.TableCell>Pembinaan</Table.TableCell>
                            <Table.TableCell>1 Agustus 2026</Table.TableCell>
                            <Table.TableCell>3 Agustus 2026</Table.TableCell>
                            <Table.TableCell>
                                <div
                                    className={cn(
                                        "w-full h-full gap-2 p-1",
                                        "flex items-center justify-center"
                                    )}
                                >
                                    <Button className="h-8 aspect-square w-fit">
                                        <Trash className="shrink-0 size-4 text-white" />
                                    </Button>
                                    <Button className="h-8 aspect-square w-fit">
                                        <PenBox className="shrink-0 size-4 text-white" />
                                    </Button>
                                    <Button className="h-8 aspect-square w-fit">
                                        <Printer className="shrink-0 size-4 text-white" />
                                    </Button>
                                </div>
                            </Table.TableCell>
                        </Table.TableRow>
                    </Table.TableBody>
                </Table.Table>
            </div>
        </div>
    )
}
