import { type DocumentInitProps, type FormInputProps } from "@/app/props/sptjb"
import {
    DocumentGetOneResponse,
    DocumentPostResponse,
    BasicAPIResponse,
    TemplateGetResponse,
    type TemplateGetResponseProps,
    DocumentGetResponse,
    type DocumentPostResponseProps,
} from "@/app/props/api"
import { type SPTJBDetailProps, type SPTJBProps } from "@/app/props/db"
import { fetchData } from "@/app/lib/global-utils"

export const handleGetDocumentData = async (
    onSuccess: (message: string, data: SPTJBProps[]) => void,
    onError: (message: string) => void,
    signal?: AbortSignal
) => {
    await fetchData(
        "/api/document/sptjb",
        {
            headers: {
                "Content-Type": "application/json",
            },
            signal,
        },
        (res) => {
            const data = DocumentGetResponse.parse(res)
            const documentData = data.data as SPTJBProps[]

            if (data.success) onSuccess(data.message, documentData)
            else onError(data.message)
        }
    )
}

export const handleGetTemplate = async (
    onSuccess: (data: TemplateGetResponseProps) => void,
    onError: (message: string) => void,
    signal?: AbortSignal
) => {
    await fetchData(
        "/api/document/template",
        {
            headers: {
                "Content-Type": "application/json",
            },
            signal,
        },
        (res) => {
            const data = TemplateGetResponse.parse(res)

            if (data.success) onSuccess(data)
            else onError(data.message)
        }
    )
}

export const handleUpdateDocument = async (
    inputData: DocumentInitProps,
    formData: FormInputProps[],
    onSuccess: (data: DocumentPostResponseProps) => void,
    onError: (message: string) => void,
    signal?: AbortSignal
) => {
    await fetchData(
        `/api/document/sptjb?id=${inputData.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: inputData.name,
                docId: inputData.docId || "",
                division: inputData.division || "",
                data: formData,
                _class: inputData._class,
            }),
            signal,
        },
        (res) => {
            const data = DocumentPostResponse.parse(res)

            if (data.success) onSuccess(data)
            else onError(data.message)
        }
    )
}

export const handleFreshSave = async (
    inputData: DocumentInitProps,
    formData: FormInputProps[],
    onSuccess: (data: DocumentPostResponseProps) => void,
    onError: (message: string) => void,
    signal?: AbortSignal
) => {
    await fetchData(
        "/api/document/sptjb",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: inputData.name,
                docId: inputData.docId || "",
                division: inputData.division || "",
                data: formData,
                _class: inputData._class,
            }),
            signal,
        },
        (res) => {
            const data = DocumentPostResponse.parse(res)

            if (data.success) onSuccess(data)
            else onError(data.message)
        }
    )
}

export const handleDeleteDocument = async (
    document: DocumentInitProps,
    id: string | undefined,
    onSuccess: (message: string) => void,
    onError: (message: string) => void,
    signal?: AbortSignal
) => {
    await fetchData(
        `/api/document/sptjb?id=${id || document.id}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            signal,
        },
        (res) => {
            const data = BasicAPIResponse.parse(res)

            if (data.success) onSuccess(data.message)
            else onError(data.message)
        }
    )
}

export const handleDocumentGetOne = async (
    id: string,
    onSuccess: (message: string, data: SPTJBDetailProps) => void,
    onError: (message: string) => void,
    signal?: AbortSignal
) => {
    await fetchData(
        `/api/document/sptjb?id=${id}`,
        {
            headers: {
                "Content-Type": "application/json",
            },
            signal,
        },
        (res) => {
            const data = DocumentGetOneResponse.parse(res)
            const documentData = data.data as SPTJBDetailProps

            if (data.success) onSuccess(data.message, documentData)
            else onError(data.message)
        }
    )
}
