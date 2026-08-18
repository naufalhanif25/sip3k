"use client"

import { usePathname } from "next/navigation"
import { cn, generatePageInfo } from "@/app/lib/global-utils"
import { useCallback, useEffect, useState } from "react"
import Dashboard from "@/app/components/dashboard/dashboard"
import variables from "@/app/data/variables.json"
import {
    type EmployeePicketProps,
    type PicketProps,
    type EmployeeBasicProps,
    EmployeePicketDataProps,
} from "@/app/props/db"
import EmployeeList from "@/app/components/dashboard/employee/employee-list"
import * as PicketHandler from "@/app/lib/picket-fetch-handler"
import { type EmployeeDataProps } from "@/app/props/picket"
import {
    EMPLOYEE_DATA_DEFAULT,
    INFO_DATA_DEFAULT,
    POPUP_DATA_DEFAULT,
} from "@/app/vars/global-vars"
import Notification from "@/app/components/notification"
import InfoPopup from "@/app/components/info-popup"
import PageHeader from "@/app/components/dashboard/page-header"
import { useInfoPopup, useNotification } from "@/app/hooks/dashboard"
import FloatingContainer from "@/app/components/floating-container"
import EmployeeAddPopup from "@/app/components/dashboard/employee/add-popup"
import EmployeeEditPopup from "@/app/components/dashboard/employee/edit-popup"
import PicketList from "@/app/components/dashboard/employee/picket/picket-list"
import TodayPicket from "@/app/components/dashboard/employee/picket/today-picket"
import PicketSwapPopup from "@/app/components/dashboard/employee/picket/swap-popup"
import { handleEditEmployeeData } from "@/app/lib/picket-handler"
import { handleSavePicketToExcel, handleSavePicketToPdf } from "@/app/lib/picket-doc-handler"
import { dateFormatter } from "@/app/lib/global-utils"

export default function Picket() {
    const path = usePathname()
    const target = variables.paths.find((data) => data.route === path)
    const subPageData = generatePageInfo(path, target)
    const [employees, setEmployees] = useState<EmployeeBasicProps[] | null>(null)
    const [pickets, setPickets] = useState<PicketProps | null>(null)
    const { infoPopupData, setPopupState, showInfoPopup } = useInfoPopup(INFO_DATA_DEFAULT)
    const [showAddPopup, setShowAddPopup] = useState<boolean>(false)
    const [todayPicket, setTodayPicket] = useState<EmployeePicketProps | null>(null)
    const [selectedPicket, setSelectedPicket] = useState<EmployeePicketProps | null>(null)
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDataProps | null>(null)
    const { notificationState, setVisibilityState, showNotification } =
        useNotification(POPUP_DATA_DEFAULT)
    const handleSetAddPopupState = () => setShowAddPopup((prev) => !prev)
    const handleCencelEditEmployee = (data: EmployeeDataProps) => {
        if (JSON.stringify(selectedEmployee) !== JSON.stringify(data)) {
            showInfoPopup(
                "PERINGATAN",
                "Apakah Anda yakin ingin membatalkan perubahan data pegawai?",
                "Batal",
                "Tutup",
                () => setPopupState(),
                () => {
                    setPopupState()
                    setSelectedEmployee(null)
                }
            )
        } else setSelectedEmployee(null)
    }
    const handleCencelAddEmployee = (data: EmployeeDataProps) => {
        if (JSON.stringify(EMPLOYEE_DATA_DEFAULT) !== JSON.stringify(data)) {
            showInfoPopup(
                "PERINGATAN",
                "Apakah Anda yakin ingin membatalkan pendaftaran pegawai?",
                "Batal",
                "Tutup",
                () => setPopupState(),
                () => {
                    setPopupState()
                    handleSetAddPopupState()
                }
            )
        } else handleSetAddPopupState()
    }
    const getEmployeeData = useCallback(
        (signal?: AbortSignal) => {
            PicketHandler.handleGetEmployeeData(
                (_, resData) => setEmployees(resData),
                (message) => showNotification("Gagal Mengambil Data Pegawai", message, "error"),
                signal
            )
        },
        [showNotification]
    )
    const getPicketData = useCallback(
        (signal?: AbortSignal) => {
            PicketHandler.handleGetPicketData(
                (_, resData) => setPickets(resData),
                (message) => showNotification("Gagal Mengambil Jadwal Piket", message, "error"),
                signal
            )
        },
        [showNotification]
    )
    const handleSubmitEditEmployee = (data: EmployeeDataProps) => {
        PicketHandler.handleEditEmployee(
            data,
            () => {
                getEmployeeData()
                showNotification(
                    "Data Pegawai Berhasil Diperbarui",
                    `Data pegawai atas nama ${data.name} berhasil diperbarui.`,
                    "notification"
                )
                setSelectedEmployee(null)
            },
            (message) => showNotification("Data Pegawai Gagal Diperbarrui", message, "error")
        )
    }
    const handleSubmitAddEmployee = (data: EmployeeDataProps) => {
        PicketHandler.handleAddNewEmployee(
            data,
            () => {
                getEmployeeData()
                showNotification(
                    "Pegawai Berhasil Didaftarkan",
                    `Pegawai atas nama ${data.name} berhasil didaftarkan.`,
                    "notification"
                )
                handleSetAddPopupState()
            },
            (message) => showNotification("Pegawai Gagal Didaftarkan", message, "error")
        )
    }
    const handleDeleteEmployee = (data: EmployeeBasicProps) => {
        showInfoPopup(
            "PERINGATAN",
            `Apakah Anda yakin ingin menghapus data pegawai atas nama ${data.name}?`,
            "Batal",
            "Hapus",
            () => setPopupState(),
            () =>
                PicketHandler.handleDeleteEmployee(
                    data.employeeId,
                    () => {
                        getEmployeeData()
                        showNotification(
                            "Pegawai Berhasil Dihapus",
                            `Pegawai dengan nama ${data.name} berhasil di hapus.`,
                            "notification"
                        )
                        setPopupState()
                    },
                    (message) => showNotification("Gagal Mengambil Data Pegawai", message, "error")
                )
        )
    }
    const handleGeneratePicket = () => {
        showInfoPopup(
            "PERINGATAN",
            "Apakah Anda yakin ingin men-generate jadwal piket pegawai?",
            "Batal",
            "Generate",
            () => setPopupState(),
            () =>
                PicketHandler.handleGeneratePicketData(
                    () => {
                        getPicketData()
                        showNotification(
                            "Generate Berhasil",
                            `Jadwal piket pegawai baru berhasil di-generate.`,
                            "notification"
                        )
                        setPopupState()
                    },
                    (message) =>
                        showNotification("Gagal Men-generate Jadwal Piket", message, "error")
                )
        )
    }
    const handleOpenPicketSwapPopup = (data: EmployeePicketProps) => {
        setSelectedPicket(data)
    }
    const handleCencelSwapPicket = (data: EmployeePicketProps) => {
        if (selectedPicket && JSON.stringify(data) !== JSON.stringify(selectedPicket)) {
            showInfoPopup(
                "PERINGATAN",
                "Apakah Anda yakin ingin membatalkan perubahan jadwal piket?",
                "Batal",
                "Tutup",
                () => setPopupState(),
                () => {
                    setPopupState()
                    setSelectedPicket(null)
                }
            )
        } else setSelectedPicket(null)
    }
    const handleSaveSwapPicket = (data: EmployeePicketProps) => {
        const currentWeekday = dateFormatter.longWeekdayFormat.format(data.schedule)
        const currentDate = dateFormatter.longFullFormat.format(data.schedule)
        showInfoPopup(
            "KONFIRMASI",
            `Apakah Anda yakin ingin mengganti data pegawai piket untuk tanggal ${currentWeekday} / ${currentDate}?`,
            "Batal",
            "Ganti",
            () => setPopupState(),
            () => {
                PicketHandler.handleSwapPicketData(
                    pickets?.id || "",
                    data,
                    () => {
                        getPicketData()
                        showNotification(
                            "Jadwal Piket Berhasil Diperbarui",
                            `Jadwal piket untuk tanggal ${currentWeekday} / ${currentDate} berhasil diperbarui.`,
                            "notification"
                        )
                        setSelectedPicket(null)
                    },
                    (message) => showNotification("Gagal Menyimpan Jadwal Piket", message, "error")
                )
                setPopupState()
            }
        )
    }
    const handleSendToEmployee = (data: EmployeePicketDataProps, date: Date) => {
        PicketHandler.handleSendNotification(
            data,
            date,
            (message) =>
                showNotification("Berhasil Mengirim Pemberitahuan", message, "notification"),
            (message) => showNotification("Gagal Mengirim Pemberitahuan", message, "error")
        )
    }
    const handleDeletePicket = (id: string, data: EmployeePicketProps) => {
        const currentWeekday = dateFormatter.longWeekdayFormat.format(data.schedule)
        const currentDate = dateFormatter.longFullFormat.format(data.schedule)
        showInfoPopup(
            "KONFIRMASI",
            `Apakah Anda yakin ingin menghapus jadwal piket pada tanggal ${currentWeekday} / ${currentDate}?`,
            "Batal",
            "Hapus",
            () => setPopupState(),
            () => {
                PicketHandler.handleDeleteTargetPicket(
                    id,
                    data.id,
                    () => {
                        getPicketData()
                        showNotification(
                            "Jadwal Piket Berhasil Dihapus",
                            `Jadwal piket untuk tanggal ${currentWeekday} / ${currentDate} berhasil dihapus.`,
                            "notification"
                        )
                    },
                    (message) => showNotification("Gagal Menghapus Jadwal Piket", message, "error")
                )
                setPopupState()
            }
        )
    }
    const handleSavePicketSheet = async () => {
        const monthYear = dateFormatter.longFormat.format(pickets?.startAt)
        await handleSavePicketToExcel(
            pickets,
            `Data Jadwal Piket ${monthYear}.xlsx`,
            "Data Jadwal Piket"
        )
    }
    const handleSavePicketDocument = () => {
        const monthYear = dateFormatter.longFormat.format(pickets?.startAt)
        handleSavePicketToPdf(
            pickets,
            "SUSUNAN JADWAL PETUGAS PIKET\n" +
                `KEJAKSAAN NEGERI BANDA ACEH BULAN ${monthYear.toLocaleUpperCase()}`,
            `Data Jadwal Piket ${monthYear}.pdf`
        )
    }

    useEffect(() => {
        const controller = new AbortController()
        const { signal } = controller

        PicketHandler.handleGetTodayPicket(
            (_, data) => setTodayPicket(data),
            (message) => showNotification("Gagal Mengambil Jadwal Piket", message, "error"),
            signal
        )
        getEmployeeData(signal)
        getPicketData(signal)
        return () => {
            controller.abort()
        }
    }, [showNotification, getEmployeeData, getPicketData])

    return (
        <Dashboard
            className={cn(
                "w-dvw h-dvh",
                "flex flex-col items-start justify-center",
                "overflow-hidden relative"
            )}
        >
            {infoPopupData.active && (
                <FloatingContainer className="w-full h-full z-100">
                    <InfoPopup
                        className="max-w-80 w-full p-5 gap-4"
                        title={infoPopupData.title}
                        description={infoPopupData.description}
                        dismissTitle={infoPopupData.dismissTitle}
                        acceptTitle={infoPopupData.acceptTitle}
                        onDismiss={infoPopupData.onDismiss}
                        onAccept={infoPopupData.onAccept}
                        onClose={infoPopupData.onClose}
                    />
                </FloatingContainer>
            )}
            {showAddPopup && (
                <FloatingContainer className="w-full h-full">
                    <EmployeeAddPopup
                        className="max-w-100 w-full h-fit p-5 gap-4"
                        onCencel={handleCencelAddEmployee}
                        onAddEmployee={handleSubmitAddEmployee}
                    />
                </FloatingContainer>
            )}
            {selectedEmployee && (
                <FloatingContainer className="w-full h-full">
                    <EmployeeEditPopup
                        className="max-w-100 w-full h-fit p-5 gap-4"
                        data={selectedEmployee}
                        onCencel={handleCencelEditEmployee}
                        onSave={handleSubmitEditEmployee}
                    />
                </FloatingContainer>
            )}
            {selectedPicket && (
                <FloatingContainer className="w-full h-full">
                    <PicketSwapPopup
                        employees={employees}
                        className="max-w-100 w-full h-fit p-5 gap-4"
                        onCencel={handleCencelSwapPicket}
                        onSave={handleSaveSwapPicket}
                        data={selectedPicket}
                    />
                </FloatingContainer>
            )}
            {notificationState.show && (
                <Notification
                    className="py-3 px-5 w-fit h-fit"
                    onClose={setVisibilityState}
                    title={notificationState.title}
                    type={notificationState.type}
                    description={notificationState.description}
                />
            )}
            <div
                className={cn("flex flex-col items-start justify-start", "p-4 gap-2 w-full h-full")}
            >
                <PageHeader
                    className="w-full h-fit"
                    title={subPageData.title}
                    description={subPageData.description}
                />
                <div
                    className={cn(
                        "flex flex-col items-center justify-start",
                        "w-full flex-1 overflow-y-auto gap-2"
                    )}
                >
                    <TodayPicket
                        data={todayPicket}
                        className="w-full h-fit"
                        onSend={handleSendToEmployee}
                    />
                    <PicketList
                        className="w-full h-fit"
                        pickets={pickets}
                        onGeneratePicket={handleGeneratePicket}
                        onSwapEmployee={handleOpenPicketSwapPopup}
                        onDeletePicket={handleDeletePicket}
                        onSaveSheet={handleSavePicketSheet}
                        onPrintSheet={handleSavePicketDocument}
                    />
                    <EmployeeList
                        className="w-full h-fit"
                        employees={employees}
                        onAddNewEmployee={handleSetAddPopupState}
                        onDeleteEmployee={handleDeleteEmployee}
                        onEditEmployee={(data) => handleEditEmployeeData(data, setSelectedEmployee)}
                    />
                </div>
            </div>
        </Dashboard>
    )
}
