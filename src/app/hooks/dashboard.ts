import { useState } from "react"
import { type NotificationStateProps, type InfoPopupStateProps } from "@/app/props/component"
import { INFO_DATA_DEFAULT, POPUP_DATA_DEFAULT } from "@/app/vars/global-vars"
import { useInfoPopupState, useNotificationState } from "./component"

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
