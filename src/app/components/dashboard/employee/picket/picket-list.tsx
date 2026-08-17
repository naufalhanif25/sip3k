"use client"

import TableTopHeader from "@/app/components/table-top-header"
import * as Table from "@/app/components/table"
import { usePagination } from "@/app/hooks/sptjb"
import { cn } from "@/app/lib/global-utils"
import { Fragment } from "react"
import { MAX_ROW_PERPAGE } from "@/app/vars/global-vars"
import { useSearch } from "@/app/hooks/component"
import Button from "@/app/components/button"
import { FileText, PenBox, Sheet, Sparkle } from "lucide-react"
import { type PicketListProps } from "@/app/props/picket"
import { dateFormatter } from "@/app/lib/global-utils"

export default function PicketList({
    pickets,
    onSwapEmployee,
    onGeneratePicket,
    onPrintSheet,
    onSaveSheet,
    className,
    ...props
}: PicketListProps) {
    const { setSearchInput, filteredData } = useSearch(pickets?.pickets || null, (picket) => {
        const firstName = picket?.employees?.first?.name ?? ""
        const secondName = picket?.employees?.second?.name ?? ""
        return `${firstName} ${secondName}`
    })
    const { currentPage, totalPages, renderData, handlePrevPage, handleNextPage } =
        usePagination(filteredData)

    return (
        <div className={cn(className, "flex flex-col items-center justify-start")} {...props}>
            <TableTopHeader
                className="w-full h-fit shrink-0 overflow-x-auto"
                title="Jadwal Piket Terkini"
                currentPage={currentPage}
                totalPages={totalPages}
                onSearch={setSearchInput}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
            >
                <Button
                    onClick={() => onGeneratePicket && onGeneratePicket()}
                    className="h-7 aspect-square w-fit text-sm"
                >
                    <Sparkle className="size-4 shrink-0" />
                </Button>
                <span
                    className={cn(
                        "w-fit h-fit gap-1 shrink-0",
                        "flex items-center justify-end",
                        "overflow-hidden"
                    )}
                >
                    <Button
                        onClick={() => onPrintSheet && onPrintSheet()}
                        className="h-7 aspect-square w-fit text-sm"
                    >
                        <FileText className="size-4 shrink-0" />
                    </Button>
                    <Button
                        onClick={() => onSaveSheet && onSaveSheet()}
                        className="h-7 aspect-square w-fit text-sm"
                    >
                        <Sheet className="size-4 shrink-0" />
                    </Button>
                </span>
            </TableTopHeader>
            {renderData && renderData.length > 0 ? (
                <div className="w-full max-w-full h-fit overflow-x-auto">
                    <Table.Table className="w-full max-w-full h-fit table-fixed">
                        <colgroup>
                            <col className="w-20" />
                            <col className="w-auto min-w-50" />
                            <col className="w-70" />
                            <col className="w-30" />
                            <col className="w-50" />
                            <col className="w-50" />
                            <col className="w-30" />
                        </colgroup>
                        <Table.TableHeader
                            names={["No.", "Nama", "NIP", "Golongan", "Pengawas", "Jadwal", "Aksi"]}
                        />
                        <Table.TableBody>
                            {renderData.map((employee, index) => {
                                const itemNumber = (currentPage - 1) * MAX_ROW_PERPAGE + index + 1

                                return (
                                    <Fragment key={index}>
                                        <Table.TableRow className="text-center">
                                            <Table.TableCell rowSpan={2}>
                                                {itemNumber}.
                                            </Table.TableCell>
                                            <Table.TableCell className="text-left">
                                                {employee.employees.first.name}
                                            </Table.TableCell>
                                            <Table.TableCell>
                                                {employee.employees.first.employeeId}
                                            </Table.TableCell>
                                            <Table.TableCell>
                                                {employee.employees.first.category}
                                            </Table.TableCell>
                                            <Table.TableCell rowSpan={2}>
                                                {employee.supervisor}
                                            </Table.TableCell>
                                            <Table.TableCell rowSpan={2}>
                                                {dateFormatter.longFullFormat.format(
                                                    employee.schedule
                                                )}
                                            </Table.TableCell>
                                            <Table.TableCell rowSpan={2}>
                                                <div
                                                    className={cn(
                                                        "w-full h-full gap-2 p-1",
                                                        "flex items-center justify-center"
                                                    )}
                                                >
                                                    <Button
                                                        onClick={() =>
                                                            onSwapEmployee &&
                                                            onSwapEmployee(employee)
                                                        }
                                                        className="h-8 aspect-square w-fit"
                                                    >
                                                        <PenBox className="shrink-0 size-4 text-white" />
                                                    </Button>
                                                </div>
                                            </Table.TableCell>
                                        </Table.TableRow>
                                        <Table.TableRow className="text-center">
                                            <Table.TableCell className="text-left">
                                                {employee.employees.second.name}
                                            </Table.TableCell>
                                            <Table.TableCell>
                                                {employee.employees.second.employeeId}
                                            </Table.TableCell>
                                            <Table.TableCell>
                                                {employee.employees.second.category}
                                            </Table.TableCell>
                                        </Table.TableRow>
                                    </Fragment>
                                )
                            })}
                        </Table.TableBody>
                    </Table.Table>
                </div>
            ) : (
                <div
                    className={cn(
                        "w-full max-w-full py-7 px-5",
                        "flex items-center justify-center",
                        "rounded-md bg-indigo-100",
                        "overflow-hidden"
                    )}
                >
                    <h4 className="max-w-full truncate text-black/50">
                        Tidak ada data piket untuk ditampilkan
                    </h4>
                </div>
            )}
        </div>
    )
}
