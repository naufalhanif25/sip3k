"use client"

import { cn } from "@/app/lib/cn"
import Dropdown from "../../dropdown"
import TextArea from "../../textarea"
import Input from "../../input"
import { AdditionalFormProps } from "@/app/props/dashboard"
import variables from "../../../data/variables.json"
import Button from "../../button"
import DayPickerInput from "../../day-picker-input"
import { Trash } from "lucide-react"

export default function AdditionalForm({
    data,
    title,
    onDelete,
    onChoose,
    onNameChange,
    onDescChange,
    onDateChange,
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
                <Button onClick={onDelete} className="aspect-square h-8 w-fit text-sm">
                    <Trash className="size-4 shrink-0" />
                </Button>
            </span>
            <span className={cn("w-full h-fit gap-2", "flex flex-col items-start justify-center")}>
                <Dropdown
                    className="w-full shrink-0 h-fit gap-2"
                    title="Kode SPTJB"
                    placeholder="Pilih Kode SPTJB"
                    options={variables.divisions.sort()}
                    value={data.code}
                    onChoose={onChoose}
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
                    title="Jumlah"
                    type="currency"
                    value={data.total}
                    onChange={onTotalChange}
                    className="w-full min-w-0 sm:flex-1 min-h-10 text-sm shrink-0"
                    placeholder="Jumlah"
                />
                <Input
                    title="PPN"
                    type="currency"
                    value={data.ppn}
                    onChange={onPPNChange}
                    className="w-full min-w-0 sm:flex-1 min-h-10 text-sm shrink-0"
                    placeholder="PPN"
                />
                <Input
                    title="PPh"
                    type="currency"
                    value={data.pph}
                    onChange={onPPhChange}
                    className="w-full min-w-0 sm:flex-1 min-h-10 text-sm shrink-0"
                    placeholder="PPh"
                />
            </span>
        </span>
    )
}
