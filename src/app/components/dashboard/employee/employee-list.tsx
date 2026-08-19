"use client"

import { cn } from "@/app/lib/global-utils"
import Button from "@/app/components/button"
import { PenBox, Plus, Trash } from "lucide-react"
import * as Table from "@/app/components/table"
import { type EmployeeListProps } from "@/app/props/picket"
import { MAX_ROW_PERPAGE } from "@/app/vars/global-vars"
import { usePagination } from "@/app/hooks/dashboard"
import { useSearch } from "@/app/hooks/component"
import TableTopHeader from "@/app/components/table-top-header"
import { useState } from "react"

export default function EmployeeList({
    employees,
    onAddNewEmployee,
    onDeleteEmployee,
    onEditEmployee,
    className,
    ...props
}: EmployeeListProps) {
    const { setSearchInput, filteredData } = useSearch(employees, (employee) => employee.name)
    const [maxPage, setMaxPage] = useState<number>()
    const { currentPage, totalPages, renderData, handlePrevPage, handleNextPage } = usePagination(
        filteredData,
        { pageSize: maxPage }
    )

    return (
        <div
            className={cn(className, "flex flex-col items-center justify-start", "gap-1")}
            {...props}
        >
            <TableTopHeader
                className="w-full h-fit shrink-0 overflow-x-auto"
                title="Daftar Pegawai"
                currentPage={currentPage}
                totalPages={totalPages}
                onSearch={setSearchInput}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
                onPageSizeChange={(value) => setMaxPage(value)}
            >
                <Button
                    onClick={() => onAddNewEmployee && onAddNewEmployee()}
                    className="h-7 aspect-square w-fit text-sm"
                >
                    <Plus className="size-4 shrink-0" />
                </Button>
            </TableTopHeader>
            {renderData && renderData.length > 0 ? (
                <div
                    className={cn(
                        "w-full max-w-full h-fit max-h-140",
                        "overflow-x-auto overflow-y-auto"
                    )}
                >
                    <Table.Table className="w-full max-w-full h-fit table-fixed">
                        <colgroup>
                            <col className="w-20" />
                            <col className="w-auto min-w-50" />
                            <col className="w-auto min-w-50" />
                            <col className="w-50" />
                            <col className="w-30" />
                            <col className="w-50" />
                            <col className="w-50" />
                            <col className="w-50" />
                        </colgroup>
                        <Table.TableHeader
                            className="sticky top-0 z-10 shadow-sm"
                            names={[
                                "No.",
                                "Nama",
                                "Jabatan",
                                "Pangkat",
                                "Golongan",
                                "NIP",
                                "No. HP",
                                "Aksi",
                            ]}
                        />
                        <Table.TableBody>
                            {renderData.map((employee, index) => {
                                const itemNumber = (currentPage - 1) * MAX_ROW_PERPAGE + index + 1

                                return (
                                    <Table.TableRow
                                        key={employee.employeeId}
                                        className="text-center"
                                    >
                                        <Table.TableCell>{itemNumber}.</Table.TableCell>
                                        <Table.TableCell className="text-left">
                                            {employee.name}
                                        </Table.TableCell>
                                        <Table.TableCell className="text-left">
                                            {employee.position}
                                        </Table.TableCell>
                                        <Table.TableCell>{employee.rank}</Table.TableCell>
                                        <Table.TableCell>
                                            {employee.class}/{employee.room}
                                        </Table.TableCell>
                                        <Table.TableCell>{employee.employeeId}</Table.TableCell>
                                        <Table.TableCell>{employee.phone}</Table.TableCell>
                                        <Table.TableCell>
                                            <div
                                                className={cn(
                                                    "w-full h-full gap-2 p-1",
                                                    "flex items-center justify-center"
                                                )}
                                            >
                                                <Button
                                                    onClick={() =>
                                                        onDeleteEmployee &&
                                                        onDeleteEmployee(employee)
                                                    }
                                                    className="h-8 aspect-square w-fit"
                                                >
                                                    <Trash className="shrink-0 size-4 text-white" />
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        onEditEmployee && onEditEmployee(employee)
                                                    }
                                                    className="h-8 aspect-square w-fit"
                                                >
                                                    <PenBox className="shrink-0 size-4 text-white" />
                                                </Button>
                                            </div>
                                        </Table.TableCell>
                                    </Table.TableRow>
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
                        Tidak ada data pegawai untuk ditampilkan
                    </h4>
                </div>
            )}
        </div>
    )
}
