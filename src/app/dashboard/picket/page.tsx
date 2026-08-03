"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/app/lib/cn"
import Dashboard from "@/app/components/dashboard/dashboard"
import { DashboardSubPage } from "@/app/props/dashboard"
import { Pegawai } from "@/app/props/picket"
import PiketCard from "@/app/components/picket/piket-card"
import PegawaiTable from "@/app/components/picket/pegawai-table"
import variables from "../../data/variables.json"

// TODO: Ganti dengan data dari API/backend
const dummyPegawai: Pegawai[] = Array.from({ length: 10 }, () => ({
    nama: "John Doe",
    nip: "19990101 200001 1 001",
    nrp: "45257821",
    noHp: "0812 1234 1234",
    jadwalPiket: "28 Juli 2026",
}))

export default function Picket() {
    const path = usePathname()
    const target = variables.paths.find((data) => data.route === path)
    const subPageData = DashboardSubPage.parse({
        title: target?.name ?? path.replace(/\b\w/g, (char) => char.toUpperCase()),
        description: target?.description ?? path.replace(/\b\w/g, (char) => char.toUpperCase()),
    })

    // TODO: Ganti dengan data piket hari ini dari API/backend
    const piketHariIni = dummyPegawai.slice(0, 3)

    return (
        <Dashboard
            className={cn(
                "w-dvw h-dvh",
                "flex flex-col items-start justify-center",
                "overflow-hidden"
            )}
        >
            <div
                className={cn("flex flex-col items-start justify-start", "p-4 gap-3 w-full h-full")}
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
                        "w-full flex-1 overflow-y-auto",
                        "flex flex-col items-start justify-start gap-5"
                    )}
                >
                    <div
                        className={cn(
                            "w-full flex flex-col items-start justify-start gap-2"
                        )}
                    >
                        <div className="flex flex-col">
                            <h3 className="text-base font-semibold w-full">
                                {variables.picket.todaySectionTitle}
                            </h3>
                            <p className="text-xs text-black/50 w-full">
                                {variables.picket.todaySectionDescription}
                            </p>
                        </div>
                        <div
                            className={cn(
                                "w-full h-fit gap-2",
                                "grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3"
                            )}
                        >
                            {piketHariIni.map((pegawai, index) => (
                                <PiketCard
                                    key={index}
                                    pegawai={pegawai}
                                    className="w-full"
                                    onSelesai={() => {
                                        // TODO: Tandai piket sebagai selesai
                                    }}
                                    onIngatkan={() => {
                                        // TODO: Kirim pengingat ke pegawai
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <div
                        className={cn(
                            "w-full flex flex-col items-start justify-start gap-2"
                        )}
                    >
                        <div className="flex flex-col">
                            <h3 className="text-base font-semibold w-full">
                                {variables.picket.listSectionTitle}
                            </h3>
                            <p className="text-xs text-black/50 w-full">
                                {variables.picket.listSectionDescription}
                            </p>
                        </div>
                        <PegawaiTable data={dummyPegawai} />
                    </div>
                </div>
            </div>
        </Dashboard>
    )
}
