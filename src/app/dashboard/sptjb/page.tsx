"use client"

import { usePathname } from "next/navigation"
import { ChangeEvent, useState } from "react"
import { cn } from "@/app/lib/cn"
import Dashboard from "@/app/components/dashboard/dashboard"
import { DashboardSubPage } from "@/app/props/dashboard"
import {
    DocumentInitProps,
    DocumentInit,
    Division,
    InfoPopupStateProps,
    InfoPopupState,
} from "@/app/props/component"
import MainSPTJB from "@/app/components/dashboard/sptjb/main-sptjb"
import variables from "../../data/variables.json"
import NewSPTJB from "@/app/components/dashboard/sptjb/new-sptjb"
import Notification from "@/app/components/notification"
import { PopupState, PopupStateProps } from "@/app/props/component"
import InfoPopup from "@/app/components/info-popup"

export default function SPTJB() {
    const path = usePathname()
    const target = variables.paths.find((data) => data.route === path)
    const subPageData = DashboardSubPage.parse({
        title: target?.name ?? path.replace(/\b\w/g, (char) => char.toUpperCase()),
        description: target?.description ?? path.replace(/\b\w/g, (char) => char.toUpperCase()),
    })
    const [openEditor, setOpenEditor] = useState<boolean>(false)
    const [documenInitInput, setDocumentInitInput] = useState<DocumentInitProps>(
        DocumentInit.parse({
            name: "",
            division: null,
        })
    )
    const [infoPopupData, setInfoPopupData] = useState<InfoPopupStateProps>(
        InfoPopupState.parse({
            title: "",
            description: "",
            dismissTitle: "",
            acceptTitle: "",
            onDismiss: () => {},
            onAccept: () => {},
            onClose: () => {},
            active: false,
        })
    )
    const [popupState, setPopupState] = useState<PopupStateProps>(
        PopupState.parse({
            show: false,
            title: "",
            description: "",
            type: "notification",
        })
    )
    const validateDocumentInput = () => {
        if (!documenInitInput.name || documenInitInput.division === null) {
            if (popupState.show) handleSetNotificationState()
            setTimeout(() => {
                setPopupState(
                    PopupState.parse({
                        show: true,
                        title: "Gagal Membuat Dokumen",
                        description:
                            "Dokumen SPTJB baru tidak dapat dibuat jika nama dokumen atau bidang kosong.",
                        type: "error",
                    })
                )
            }, 1)
            return false
        }
        return true
    }
    const onCreate = () => {
        const isDocumentInputValid = validateDocumentInput()
        if (!isDocumentInputValid) return

        setOpenEditor(true)
    }
    const handleSetNotificationState = () =>
        setPopupState((prev) => ({
            ...prev,
            show: !prev.show,
        }))
    const handleNameChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) =>
        setDocumentInitInput((prev) => ({
            ...prev,
            name: e.target.value,
        }))
    const handleDivisionChange = (value: string) =>
        setDocumentInitInput((prev) => ({
            ...prev,
            division: value as Division,
        }))
    const handleSetPopupState = () =>
        setInfoPopupData((prev) => ({ ...prev, active: !prev.active }))
    const handleDeleteSPTJB = (isChanged: boolean) => {
        const isDocumentInputValid = validateDocumentInput()
        if (!isDocumentInputValid) return

        if (isChanged) {
            setInfoPopupData(
                InfoPopupState.parse({
                    title: "PERINGATAN",
                    description: "Apakah Anda ingin membuang seluruh perubahan pada dokumen SPTJB?",
                    dismissTitle: "Batal",
                    acceptTitle: "Hapus",
                    onDismiss: () => {
                        handleSetPopupState()
                        setOpenEditor(false)
                    },
                    onAccept: () => {
                        handleSetPopupState()
                        setOpenEditor(false)
                    },
                    onClose: handleSetPopupState,
                    active: true,
                })
            )
        } else setOpenEditor(false)
    }
    const handleSaveSPTJB = () => {}
    const handleBackSPTJB = (isChanged: boolean) => {
        const isDocumentInputValid = validateDocumentInput()
        if (!isDocumentInputValid) return

        if (isChanged) {
            setInfoPopupData(
                InfoPopupState.parse({
                    title: "PERINGATAN",
                    description:
                        "Apakah Anda ingin menyimpan perubahan terlebih dahulu sebelum keluar dari editor SPTJB?",
                    dismissTitle: "Keluar",
                    acceptTitle: "Simpan & Keluar",
                    onDismiss: () => {
                        handleSetPopupState()
                        setOpenEditor(false)
                    },
                    onAccept: () => {
                        handleSetPopupState()
                        setOpenEditor(false)
                    },
                    onClose: handleSetPopupState,
                    active: true,
                })
            )
        } else setOpenEditor(false)
    }
    const handlePrintSPTJB = () => {}

    return (
        <Dashboard
            className={cn(
                "w-dvw h-dvh",
                "flex flex-col items-start justify-center",
                "overflow-hidden relative"
            )}
        >
            {infoPopupData.active && (
                <div
                    className={cn(
                        "absolute top-0 left-0 w-full h-full p-8",
                        "flex items-center justify-center",
                        "overflow-hidden bg-black/50 z-100"
                    )}
                >
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
                </div>
            )}
            {popupState.show && (
                <Notification
                    className={cn("py-3 px-5 w-fit h-fit")}
                    onClose={handleSetNotificationState}
                    title={popupState.title}
                    type={popupState.type}
                    description={popupState.description}
                />
            )}
            <div
                className={cn(
                    "flex flex-col items-start justify-start",
                    "p-4 gap-4 w-full h-full",
                    "relative"
                )}
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
                {openEditor ? (
                    <NewSPTJB
                        data={documenInitInput}
                        className={cn("w-full flex-1 overflow-hidden", "flex flex-col gap-2")}
                        onDelete={handleDeleteSPTJB}
                        onSave={handleSaveSPTJB}
                        onPrint={handlePrintSPTJB}
                        onBack={handleBackSPTJB}
                        onNameChange={(e) => handleNameChange(e)}
                        onChoose={(value) => handleDivisionChange(value)}
                    />
                ) : (
                    <MainSPTJB
                        data={documenInitInput}
                        onNameChange={(e) => handleNameChange(e)}
                        onChoose={(value) => handleDivisionChange(value)}
                        onCreate={onCreate}
                        className={cn("w-full flex-1 overflow-hidden", "flex flex-col gap-4")}
                    />
                )}
            </div>
        </Dashboard>
    )
}
