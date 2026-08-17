import { useMemo, useState, Dispatch, useCallback, SetStateAction } from "react"
import { fuzzyMatch } from "@/app/lib/global-utils"
import {
    InfoPopupState,
    type InfoPopupStateProps,
    NotificationState,
    type NotificationStateProps,
    NotificationType,
} from "@/app/props/component"

export function useFocus(initValue?: boolean) {
    const [isFocus, setIsFocus] = useState<boolean>(initValue ?? false)
    const handleFocus = () => setIsFocus(true)
    const handleUnfocus = () => setIsFocus(false)

    return {
        isFocus,
        handleFocus,
        handleUnfocus,
    }
}

export function useSearch<T>(data: T[] | null, getTarget: (data: T) => string) {
    const [searchInput, setSearchInput] = useState<string>("")
    const filteredData = useMemo(() => {
        if (!searchInput || !data) return data
        return data.filter((data) => fuzzyMatch(getTarget(data), searchInput))
    }, [searchInput, data, getTarget])
    return {
        setSearchInput,
        filteredData,
    }
}

export function useInfoPopupState(
    setter: Dispatch<SetStateAction<InfoPopupStateProps>>,
    onClose: () => void
) {
    const stateSetter = useCallback(
        (
            title: string,
            description: string,
            dismissTitle: string,
            acceptTitle: string,
            onDismiss: () => void,
            onAccept: () => void
        ) => {
            setter(
                InfoPopupState.parse({
                    title: title,
                    description: description,
                    dismissTitle: dismissTitle,
                    acceptTitle: acceptTitle,
                    onDismiss,
                    onAccept,
                    onClose: onClose,
                    active: true,
                })
            )
        },
        [setter, onClose]
    )
    return stateSetter
}

export function useNotificationState(
    isShown: boolean,
    setter: Dispatch<SetStateAction<NotificationStateProps>>,
    onShow: () => void
) {
    const stateSetter = useCallback(
        (title: string, description: string, type: NotificationType) => {
            if (isShown) onShow()
            setTimeout(() => {
                setter(
                    NotificationState.parse({
                        show: true,
                        title: title,
                        description: description,
                        type: type,
                    })
                )
            }, 1)
        },
        [isShown, setter, onShow]
    )
    return stateSetter
}
