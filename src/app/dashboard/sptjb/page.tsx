"use client"

import { usePathname } from "next/navigation"
import { ChangeEvent, useState, useRef } from "react"
import { cn, generatePageInfo } from "@/app/lib/global-utils"
import Dashboard from "@/app/components/dashboard/dashboard"
import { type DocumentInitProps, type FormInputProps } from "@/app/props/sptjb"
import MainSPTJB from "@/app/components/dashboard/sptjb/main-sptjb"
import variables from "@/app/data/variables.json"
import { NewSPTJB } from "@/app/components/dashboard/sptjb/new-sptjb"
import Notification from "@/app/components/notification"
import InfoPopup from "@/app/components/info-popup"
import { useReactToPrint } from "react-to-print"
import * as SPTJBFetchHandler from "@/app/lib/sptjb-fetch-handler"
import { validateDocumentInput } from "@/app/lib/sptjb-utils-handler"
import { type DocumentPostResponseProps } from "@/app/props/api"
import { PreviewPopup } from "@/app/components/dashboard/sptjb/preview-popup"
import { DOC_DATA_DEFAULT, INFO_DATA_DEFAULT, POPUP_DATA_DEFAULT } from "@/app/vars/global-vars"
import PageHeader from "@/app/components/dashboard/page-header"
import { useInfoPopup, useNotification } from "@/app/hooks/dashboard"
import * as SPTJBMainHandler from "@/app/lib/sptjb-main-handle"
import FloatingContainer from "@/app/components/floating-container"

export default function SPTJB() {
    const path = usePathname()
    const printRef = useRef<HTMLDivElement | null>(null)
    const target = variables.routes.find((data) => data.route === path)
    const subPageData = generatePageInfo(path, target)
    const [openEditor, setOpenEditor] = useState<boolean>(false)
    const [openViewPopup, setOpenViewPopup] = useState<boolean>(false)
    const [documenInitInput, setDocumentInitInput] = useState<DocumentInitProps>(DOC_DATA_DEFAULT)
    const [viewPopupDocument, setViewPopupDocument] = useState<DocumentInitProps>(DOC_DATA_DEFAULT)
    const [formDataParent, setFormDataParent] = useState<FormInputProps[] | null>(null)
    const { infoPopupData, setPopupState, showInfoPopup } = useInfoPopup(INFO_DATA_DEFAULT)
    const { notificationState, setVisibilityState, showNotification } =
        useNotification(POPUP_DATA_DEFAULT)
    const handleSetEditorState = () => setOpenEditor((prev) => !prev)
    const handleValidateDocumentInput = () => {
        return validateDocumentInput(documenInitInput, () =>
            showNotification(
                "Gagal Membuat Dokumen",
                "Dokumen SPTJB baru tidak dapat dibuat jika nama dokumen atau bidang kosong.",
                "error"
            )
        )
    }
    const handleCreate = () => {
        const isDocumentInputValid = handleValidateDocumentInput()
        if (!isDocumentInputValid) return
        handleSetEditorState()
    }
    const handleDocIDChange = (value: string) => {
        SPTJBMainHandler.handleChangeDocID(setDocumentInitInput, value)
    }
    const handleNameChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        SPTJBMainHandler.handleChangeName(setDocumentInitInput, e)
    }
    const handleDivisionChange = (value: string) => {
        SPTJBMainHandler.handleChangeDivision(setDocumentInitInput, value)
    }
    const handleClassChange = (value: string) => {
        SPTJBMainHandler.handleChangeClass(setDocumentInitInput, value)
    }
    const handleResetData = () => {
        setDocumentInitInput(DOC_DATA_DEFAULT)
        setFormDataParent(null)
    }
    const handleDeleteSPTJB = (afterDelete?: () => void, id?: string) => {
        if (!documenInitInput.id && !id) return
        showInfoPopup(
            "PERINGATAN",
            "Apakah Anda yakin ingin menghapus dokumen SPTJB ini?",
            "Batal",
            "Hapus",
            () => setPopupState(),
            () => {
                setPopupState()
                SPTJBFetchHandler.handleDeleteDocument(
                    documenInitInput,
                    id,
                    () => {
                        showNotification(
                            "Dokumen Berhasil Dihapus",
                            `Dokumen dengan nama ${documenInitInput.name} berhasil di hapus.`,
                            "notification"
                        )
                        if (afterDelete) afterDelete()
                    },
                    (message) => showNotification("Dokumen Gagal Dihapus", message, "error")
                )
                if (openEditor) {
                    handleResetData()
                    handleSetEditorState()
                }
            }
        )
    }
    const handleSetViewPopupState = () => {
        setOpenViewPopup((prev) => !prev)
    }
    const handleViewSPTJB = (id: string) => {
        if (!viewPopupDocument.id && !id) return
        SPTJBFetchHandler.handleDocumentGetOne(
            id,
            (_, data) => {
                SPTJBMainHandler.handleChangeDocument(setViewPopupDocument, data)
                setFormDataParent(data.data)
                handleSetViewPopupState()
            },
            (message) => showNotification("Dokumen Gagal Dibuka", message, "error")
        )
    }
    const handleChooseDocument = (id: string) => {
        SPTJBFetchHandler.handleDocumentGetOne(
            id,
            (_, data) => {
                SPTJBMainHandler.handleChangeDocument(setDocumentInitInput, data)
                setFormDataParent(data.data)
                handleSetEditorState()
            },
            (message) => showNotification("Dokumen Gagal Dibuka", message, "error")
        )
    }
    const handleSaveSPTJB = (formData: FormInputProps[], callback?: (id: string) => void) => {
        const isDocumentInputValid = handleValidateDocumentInput()
        if (!isDocumentInputValid) return
        const saveCallback = (data: DocumentPostResponseProps) => {
            showNotification("Berhasil Menyimpan Perubahan", data.message, "notification")
            SPTJBMainHandler.handleChangeID(setDocumentInitInput, data.data.id)
            setFormDataParent(formData)
            if (callback) callback(data.data.id)
        }
        if (documenInitInput.id) {
            SPTJBFetchHandler.handleUpdateDocument(
                documenInitInput,
                formData,
                (data) => saveCallback(data),
                (message) => showNotification("Gagal Menyimpan Perubahan", message, "error")
            )
        } else {
            SPTJBFetchHandler.handleFreshSave(
                documenInitInput,
                formData,
                (data) => saveCallback(data),
                (message) => showNotification("Gagal Menyimpan Dokumen", message, "error")
            )
        }
    }
    const handleBackSPTJB = (isChanged: boolean, formData: FormInputProps[]) => {
        const isDocumentInputValid = handleValidateDocumentInput()
        if (!isDocumentInputValid) return
        const backCallback = (callback?: () => void) => {
            if (callback) callback()
            handleSetEditorState()
            handleResetData()
        }
        if (isChanged) {
            showInfoPopup(
                "KONFIRMASI",
                "Apakah Anda ingin menyimpan perubahan terlebih dahulu sebelum keluar dari editor SPTJB?",
                "Keluar",
                "Simpan & Keluar",
                () => backCallback(setPopupState),
                () =>
                    backCallback(() => {
                        setPopupState()
                        handleSaveSPTJB(formData)
                    })
            )
        } else backCallback()
    }
    const handleViewPopupClose = () => {
        setViewPopupDocument(DOC_DATA_DEFAULT)
        handleResetData()
        handleSetViewPopupState()
    }
    const handleViewPopupOpen = () => {
        const targetId = viewPopupDocument.id

        setDocumentInitInput(viewPopupDocument)
        setViewPopupDocument(DOC_DATA_DEFAULT)
        handleSetViewPopupState()

        if (targetId) handleChooseDocument(targetId)
    }
    const handleTriggerPrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: documenInitInput.name || "Dokumen-SPTJB",
    })

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
            {notificationState.show && (
                <Notification
                    className={cn("py-3 px-5 w-fit h-fit")}
                    onClose={setVisibilityState}
                    title={notificationState.title}
                    type={notificationState.type}
                    description={notificationState.description}
                />
            )}
            <div
                className={cn(
                    "flex flex-col items-start justify-start",
                    "p-4 gap-4 w-full h-full",
                    "relative"
                )}
            >
                <PageHeader
                    className="w-full h-fit"
                    title={subPageData.title}
                    description={subPageData.description}
                />
                {openEditor ? (
                    <NewSPTJB
                        ref={printRef}
                        parentForm={formDataParent}
                        data={documenInitInput}
                        className={cn("w-full flex-1 overflow-hidden", "flex flex-col gap-2")}
                        onDelete={() => handleDeleteSPTJB()}
                        onSave={handleSaveSPTJB}
                        onPrint={() => handleTriggerPrint()}
                        onBack={handleBackSPTJB}
                        onNameChange={(e) => handleNameChange(e)}
                        onChoose={(value) => handleDivisionChange(value)}
                        onClassChoose={(value) => handleClassChange(value)}
                        setDocId={handleDocIDChange}
                        errorFallback={(title, message) =>
                            showNotification(title, message, "error")
                        }
                    />
                ) : (
                    <MainSPTJB
                        data={documenInitInput}
                        onNameChange={(e) => handleNameChange(e)}
                        onDivisionChoose={(value) => handleDivisionChange(value)}
                        onClassChoose={(value) => handleClassChange(value)}
                        onCreate={handleCreate}
                        onItemOpen={handleChooseDocument}
                        onItemDelete={handleDeleteSPTJB}
                        onItemView={handleViewSPTJB}
                        errorFallback={(title, message) =>
                            showNotification(title, message, "error")
                        }
                        className={cn("w-full flex-1 overflow-y-auto", "flex flex-col gap-4")}
                    />
                )}
            </div>
            {openViewPopup && (
                <FloatingContainer className="w-full h-full z-100">
                    <PreviewPopup
                        ref={printRef}
                        className="w-full h-full"
                        formData={formDataParent}
                        data={viewPopupDocument}
                        onClose={handleViewPopupClose}
                        onOpen={handleViewPopupOpen}
                        onPrint={() => handleTriggerPrint()}
                        errorFallback={(title, message) =>
                            showNotification(title, message, "error")
                        }
                    />
                </FloatingContainer>
            )}
        </Dashboard>
    )
}
