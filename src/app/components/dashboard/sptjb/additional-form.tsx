"use client"

import { cn } from "@/app/lib/global-utils"
import TextArea from "@/app/components/textarea"
import Input from "@/app/components/input"
import { type AdditionalFormProps } from "@/app/props/sptjb"
import Button from "@/app/components/button"
import DayPickerInput from "@/app/components/day-picker-input"
import { Trash } from "lucide-react"
import { currencyFormatter } from "@/app/lib/sptjb-utils-handler"

export default function AdditionalForm({
    data,
    title,
    onDelete,
    onCodeChange,
    onNameChange,
    onDescChange,
    onDateChange,
    onIDChange,
    onTotalChange,
    onPPNChange,
    onPPhChange,
    className,
    ...props
}: AdditionalFormProps) {
    return (
        <span
            className={cn(
                className,
                "flex flex-col items-start justify-center",
                "bg-indigo-200 rounded-md",
                "overflow-hidden"
            )}
            {...props}
        >
            <span
                className={cn(
                    "w-full h-fit gap-2",
                    "flex items-center justify-between",
                    "overflow-hidden"
                )}
            >
                <h6 className="text-sm font-semibold max-w-full truncate">{title}</h6>
                <Button onClick={() => onDelete && onDelete()} className="aspect-square h-8 w-fit text-sm">
                    <Trash className="size-4 shrink-0" />
                </Button>
            </span>
            <span className={cn("w-full h-fit gap-2", "flex flex-col items-start justify-center")}>
                <Input
                    title="Kode Akun"
                    type="text"
                    value={data.code}
                    onChange={onCodeChange}
                    className="w-full min-w-0 sm:flex-1 min-h-10 text-sm shrink-0"
                    placeholder="Kode Akun"
                />
                <Input
                    title="Nama Penerima"
                    type="text"
                    value={data.name}
                    onChange={onNameChange}
                    className="w-full min-w-0 sm:flex-1 min-h-10 text-sm shrink-0"
                    placeholder="Nama Penerima"
                />
                <TextArea
                    title="Uraian Pengeluaran"
                    value={data.description}
                    onChange={onDescChange}
                    className="w-full min-w-0 sm:flex-1 min-h-30 text-sm shrink-0"
                    placeholder="Uraian Pengeluaran"
                />
                <DayPickerInput
                    title="Tanggal"
                    value={data.date}
                    onChange={onDateChange}
                    className="w-full min-w-0 sm:flex-1 min-h-10 text-sm shrink-0"
                />
                <Input
                    title="Nomor Bukti"
                    type="text"
                    value={data.id}
                    onChange={onIDChange}
                    className="w-full min-w-0 sm:flex-1 min-h-10 text-sm shrink-0"
                    placeholder="Nomor Bukti"
                />
                <Input
                    title="Jumlah"
                    type="currency"
                    value={currencyFormatter.format(data.total)}
                    onChange={onTotalChange}
                    className="w-full min-w-0 sm:flex-1 min-h-10 text-sm shrink-0"
                    placeholder="Jumlah"
                />
                <Input
                    title="PPN"
                    type="currency"
                    value={currencyFormatter.format(data.ppn)}
                    onChange={onPPNChange}
                    className="w-full min-w-0 sm:flex-1 min-h-10 text-sm shrink-0"
                    placeholder="PPN"
                />
                <Input
                    title="PPh"
                    type="currency"
                    value={currencyFormatter.format(data.pph)}
                    onChange={onPPhChange}
                    className="w-full min-w-0 sm:flex-1 min-h-10 text-sm shrink-0"
                    placeholder="PPh"
                />
            </span>
        </span>
    )
}
