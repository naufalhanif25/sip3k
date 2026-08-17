"use client"

import { cn } from "@/app/lib/global-utils"
import PicketBox from "@/app/components/dashboard/employee/picket-box"
import { TodayPicketProps } from "@/app/props/picket"

export default function TodayPicket({ data, className, onSend, ...props }: TodayPicketProps) {
    return (
        <div className={cn("flex flex-col items-center justify-start", className)} {...props}>
            <span className={cn("w-full h-fit px-1 py-2")}>
                <h2 className="font-semibold text-md truncate text-nowrap max-w-full">
                    Piket Hari Ini
                </h2>
            </span>
            {data ? (
                <span
                    className={cn(
                        "w-full h-fit gap-2",
                        "grid grid-cols-1 sm:grid-cols-2 grid-rows-2 sm:grid-rows-1"
                    )}
                >
                    <PicketBox
                        className="w-full h-fit p-4"
                        name={data.employees.first.name}
                        category={data.employees.first.category}
                        employeeId={data.employees.first.employeeId}
                        onRemind={() => onSend && onSend(data.employees.first, data.schedule)}
                    />
                    <PicketBox
                        className="w-full h-fit p-4"
                        name={data.employees.second.name}
                        category={data.employees.second.category}
                        employeeId={data.employees.second.employeeId}
                        onRemind={() => onSend && onSend(data.employees.second, data.schedule)}
                    />
                </span>
            ) : (
                <span
                    className={cn(
                        "w-full max-w-full py-7 px-5",
                        "flex items-center justify-center",
                        "bg-indigo-100 rounded-md",
                        "overflow-hidden"
                    )}
                >
                    <h4 className="text-black/50 max-w-full truncate">
                        Tidak ada jadwal piket hari ini.
                    </h4>
                </span>
            )}
        </div>
    )
}
