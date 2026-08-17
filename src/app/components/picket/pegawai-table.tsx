"use client"

import { cn } from "@/app/lib/cn"
import { PegawaiTableProps } from "@/app/props/picket"
import variables from "../../data/variables.json"

export default function PegawaiTable({ data, className, ...props }: PegawaiTableProps) {
    return (
        <div
            className={cn(
                className,
                "w-full overflow-x-auto rounded-lg",
                "border-2 border-indigo-300"
            )}
            {...props}
        >
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-indigo-300">
                        {variables.picket.tableHeaders.map((header, index) => (
                            <th
                                key={index}
                                className={cn(
                                    "px-4 py-2 text-left font-semibold",
                                    "whitespace-nowrap"
                                )}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((pegawai, index) => (
                        <tr
                            key={index}
                            className={cn(
                                index % 2 === 0 ? "bg-indigo-50" : "bg-white",
                                "border-t border-indigo-200"
                            )}
                        >
                            <td className="px-4 py-2 whitespace-nowrap">{index + 1}.</td>
                            <td className="px-4 py-2 whitespace-nowrap">{pegawai.nama}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{pegawai.nip}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{pegawai.nrp}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{pegawai.noHp}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{pegawai.jadwalPiket}</td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td
                                colSpan={variables.picket.tableHeaders.length}
                                className="px-4 py-6 text-center text-black/50"
                            >
                                Belum ada data pegawai.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
