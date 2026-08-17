import { Dispatch, SetStateAction, ChangeEvent } from "react"
import {
    Division,
    DocumentInit,
    type DocumentInitProps,
    type FormInputProps,
    SPTJBBasicMetadata,
} from "@/app/props/sptjb"
import { type SPTJBDetailProps } from "@/app/props/db"
import { type TemplateGetResponseProps } from "@/app/props/api"
import { currencyFormatter } from "@/app/lib/sptjb-utils-handler"
import { generateDocId } from "@/app/lib/sptjb-utils-handler"
import variables from "@/app/data/variables.json"
import { dateTZ } from "@/app/lib/date-timezone"
import { dateFormatter } from "@/app/lib/global-utils"

export const handleChangeDocument = (
    setter: Dispatch<SetStateAction<DocumentInitProps>>,
    data: SPTJBDetailProps
) => {
    setter(
        DocumentInit.parse({
            id: data.id,
            docId: data.docId,
            name: data.name,
            division: data.division as Division,
            _class: data._class,
        })
    )
}

export const handleChangeDocID = (
    setter: Dispatch<SetStateAction<DocumentInitProps>>,
    value: string
) => {
    setter((prev) => ({
        ...prev,
        docId: value,
    }))
}

export const handleChangeName = (
    setter: Dispatch<SetStateAction<DocumentInitProps>>,
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>
) => {
    setter((prev) => ({
        ...prev,
        name: e.target.value,
    }))
}

export const handleChangeDivision = (
    setter: Dispatch<SetStateAction<DocumentInitProps>>,
    value: string
) => {
    setter((prev) => ({
        ...prev,
        division: value as Division,
    }))
}

export const handleChangeClass = (
    setter: Dispatch<SetStateAction<DocumentInitProps>>,
    value: string
) => {
    setter((prev) => ({
        ...prev,
        _class: value,
    }))
}

export const handleChangeID = (
    setter: Dispatch<SetStateAction<DocumentInitProps>>,
    value: string
) => {
    setter((prev) => ({
        ...prev,
        id: value,
    }))
}

export const getMetadata = (
    data: DocumentInitProps,
    formData: FormInputProps[],
    templateData: TemplateGetResponseProps | null
) => {
    const total = formData.reduce((sum, item) => sum + (item.total || 0), 0)
    const ppn = formData.reduce((sum, item) => sum + (item.ppn || 0), 0)
    const pph = formData.reduce((sum, item) => sum + (item.pph || 0), 0)
    const totalBudget = currencyFormatter.format(total)
    const ppnBudget = currencyFormatter.format(ppn)
    const pphBudget = currencyFormatter.format(pph)

    let docId = data.docId
    if (!docId && templateData?.data) {
        const documentCode = templateData.data.code
        const documentIndex = (templateData.data.length || 0) + 1
        docId = generateDocId(documentIndex, documentCode)
    }
    const budgetPrefix = variables.budgetprefix[data.division as Division]
    const budgetId = `${budgetPrefix}.${data._class}`

    return SPTJBBasicMetadata.parse({
        docId,
        budgetId,
        total: `Rp ${totalBudget}`,
        ppn: `Rp ${ppnBudget}`,
        pph: `Rp ${pphBudget}`,
        division: data.division || "",
        date: dateFormatter.longFormat.format(dateTZ.nowDate()),
    })
}
