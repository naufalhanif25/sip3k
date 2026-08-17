"use client"

import { cn, dateFormatter } from "@/app/lib/global-utils"
import Button from "@/app/components/button"
import { Trash, PenBox, View } from "lucide-react"
import * as Table from "@/app/components/table"
import { type DocumentListProps } from "@/app/props/sptjb"
import { usePagination } from "@/app/hooks/sptjb"
import { useSearch } from "@/app/hooks/component"
import TableTopHeader from "@/app/components/table-top-header"

export default function DocumentList({
    onOpenTrigger,
    onDeleteTrigger,
    onViewTrigger,
    data,
    className,
    ...props
}: DocumentListProps) {
    const { setSearchInput, filteredData } = useSearch(data, (doc) => doc.name)
    const { currentPage, totalPages, renderData, handlePrevPage, handleNextPage } =
        usePagination(filteredData)

    return (
        <div
            className={cn(className, "flex flex-col items-start justify-start", "gap-2")}
            {...props}
        >
            {data && data.length > 0 && (
                <TableTopHeader
                    className="w-full h-fit shrink-0 overflow-x-auto"
                    title="Daftar Dokumen SPTJB"
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onSearch={setSearchInput}
                    onPrevPage={handlePrevPage}
                    onNextPage={handleNextPage}
                ></TableTopHeader>
            )}
            {renderData && renderData.length > 0 ? (
                <div
                    className={cn(
                        "w-full flex-1 overflow-x-auto",
                        "flex flex-col items-start justify-start"
                    )}
                >
                    <Table.Table className="w-full h-fit table-fixed">
                        <colgroup>
                            <col className="w-70" />
                            <col className="w-auto min-w-50" />
                            <col className="w-50" />
                            <col className="w-50" />
                            <col className="w-50" />
                            <col className="w-70" />
                        </colgroup>
                        <Table.TableHeader
                            names={[
                                "No. Surat",
                                "Nama",
                                "Bidang",
                                "Dibuat pada",
                                "Diperbarui pada",
                                "Aksi",
                            ]}
                        />
                        <Table.TableBody>
                            {renderData.map((item) => {
                                return (
                                    <Table.TableRow key={item.id} className="text-center">
                                        <Table.TableCell>{item.docId}</Table.TableCell>
                                        <Table.TableCell className="text-left">
                                            {item.name}
                                        </Table.TableCell>
                                        <Table.TableCell>{item.division}</Table.TableCell>
                                        <Table.TableCell>
                                            {dateFormatter.longFullFormat.format(item.createdAt)}
                                        </Table.TableCell>
                                        <Table.TableCell>
                                            {dateFormatter.longFullFormat.format(item.updatedAt)}
                                        </Table.TableCell>
                                        <Table.TableCell>
                                            <div
                                                className={cn(
                                                    "w-full h-full gap-2 p-1",
                                                    "flex items-center justify-center"
                                                )}
                                            >
                                                <Button
                                                    onClick={() =>
                                                        onDeleteTrigger && onDeleteTrigger(item.id)
                                                    }
                                                    className="h-8 aspect-square w-fit"
                                                >
                                                    <Trash className="shrink-0 size-4 text-white" />
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        onOpenTrigger && onOpenTrigger(item.id)
                                                    }
                                                    className="h-8 aspect-square w-fit"
                                                >
                                                    <PenBox className="shrink-0 size-4 text-white" />
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        onViewTrigger && onViewTrigger(item.id)
                                                    }
                                                    className="h-8 aspect-square w-fit"
                                                >
                                                    <View className="shrink-0 size-4 text-white" />
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
                        "w-full flex-1 py-7 px-5",
                        "flex items-center justify-center",
                        "rounded-md bg-indigo-100 overflow-hidden"
                    )}
                >
                    <h4 className="max-w-full truncate text-black/50">
                        Tidak ada dokumen untuk ditampilkan
                    </h4>
                </div>
            )}
        </div>
    )
}
