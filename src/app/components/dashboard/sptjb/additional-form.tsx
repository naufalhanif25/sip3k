"use client"

import { cn } from "@/app/lib/cn"
import Dropdown from "../../dropdown"
import TextArea from "../../textarea"
import Input from "../../input"
import { AdditionalFormProps } from "@/app/props/dashboard"
import variables from "../../../data/variables.json"

export default function AdditionalForm({
    data,
    title,
    onChoose,
    onNameChange,
    onDescChange,
    onDateChange,
    onTotalChange,
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
            <h6 className="text-sm font-semibold max-w-full truncate">{title}</h6>
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
                <Input
                    title="Tanggal"
                    type="date"
                    value={data.date.toISOString().split("T")[0]}
                    onChange={onDateChange}
                    className="w-full min-w-0 sm:flex-1 min-h-10 text-sm shrink-0"
                    placeholder="Tanggal"
                />
                <Input
                    title="Jumlah"
                    type="currency"
                    value={data.total}
                    onChange={onTotalChange}
                    className="w-full min-w-0 sm:flex-1 min-h-10 text-sm shrink-0"
                    placeholder="Jumlah"
                />
            </span>
        </span>
    )
}
