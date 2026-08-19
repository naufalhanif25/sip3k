import { useMemo, useState } from "react"
import { type NotificationStateProps, type InfoPopupStateProps } from "@/app/props/component"
import { INFO_DATA_DEFAULT, MAX_LIST_LENGTH, POPUP_DATA_DEFAULT } from "@/app/vars/global-vars"
import { useInfoPopupState, useNotificationState } from "@/app/hooks/component"

export function useInfoPopup(initData?: InfoPopupStateProps) {
    const [infoPopupData, setInfoPopupData] = useState<InfoPopupStateProps>(
        initData ?? INFO_DATA_DEFAULT
    )
    const setPopupState = () => setInfoPopupData((prev) => ({ ...prev, active: !prev.active }))
    const showInfoPopup = useInfoPopupState(setInfoPopupData, setPopupState)
    return {
        infoPopupData,
        setPopupState,
        showInfoPopup,
    }
}

export function useNotification(initData?: NotificationStateProps) {
    const [notificationState, setNotificationState] = useState<NotificationStateProps>(
        initData ?? POPUP_DATA_DEFAULT
    )
    const setVisibilityState = () =>
        setNotificationState((prev) => ({
            ...prev,
            show: !prev.show,
        }))
    const showNotification = useNotificationState(
        notificationState.show,
        setNotificationState,
        setVisibilityState
    )
    return {
        notificationState,
        setVisibilityState,
        showNotification,
    }
}

export function usePagination<T>(
    data?: T[] | null,
    options?: {
        pageSize?: number
    }
) {
    const inputPageSize = options?.pageSize === 0 ? MAX_LIST_LENGTH : options?.pageSize
    const pageSize = inputPageSize ?? MAX_LIST_LENGTH
    const [currentPage, setCurrentPage] = useState<number>(1)
    const totalPages = useMemo(() => {
        if (!data || data.length === 0) return 1
        return Math.ceil(data.length / pageSize)
    }, [data, pageSize])
    const renderData = useMemo(() => {
        if (!data) return null
        const startIndex = (currentPage - 1) * pageSize
        return data.slice(startIndex, startIndex + pageSize)
    }, [data, currentPage, pageSize])
    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }
    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }
    return {
        currentPage,
        totalPages,
        renderData,
        handlePrevPage,
        handleNextPage,
    }
}
