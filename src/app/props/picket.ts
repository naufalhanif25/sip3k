import { HTMLAttributes } from "react"

export interface Pegawai {
    nama: string
    nip: string
    nrp: string
    noHp: string
    jadwalPiket: string
}

export interface PiketCardProps extends HTMLAttributes<HTMLSpanElement> {
    pegawai: Pegawai
    onSelesai?: () => void
    onIngatkan?: () => void
}

export interface PegawaiTableProps extends HTMLAttributes<HTMLDivElement> {
    data: Pegawai[]
}
