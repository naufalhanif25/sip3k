import { InfoPopupState, NotificationState } from "@/app/props/component"
import { DocumentInit, FormInput } from "@/app/props/sptjb"
import { EmployeeData } from "@/app/props/picket"
import { UserData } from "@/app/props/api"
import { UserLogin } from "@/app/props/user"
import { dateTZ } from "@/app/lib/date-timezone"

export const DOC_DATA_DEFAULT = DocumentInit.parse({
    id: null,
    docId: null,
    name: "",
    division: null,
    _class: "",
})

export const EMPLOYEE_DATA_DEFAULT = EmployeeData.parse({
    employeeId: "",
    name: "",
    position: "",
    category: null,
    rank: "",
    phone: "",
    gender: null,
})

export const INFO_DATA_DEFAULT = InfoPopupState.parse({
    title: "",
    description: "",
    dismissTitle: "",
    acceptTitle: "",
    onDismiss: () => {},
    onAccept: () => {},
    onClose: () => {},
    active: false,
})

export const USER_DATA_DEFAULT = UserData.parse({
    username: "Pengguna",
})

export const USER_LOGIN_DATA_DEFAULT = UserLogin.parse({
    username: "",
    password: "",
    isRemember: false,
})

export const POPUP_DATA_DEFAULT = NotificationState.parse({
    show: false,
    title: "",
    description: "",
    type: "notification",
})

export const FORM_INPUT_DEFAULT = FormInput.parse({
    code: 0,
    name: "",
    description: "",
    date: dateTZ.nowDate(),
    id: 0,
    total: 0,
    ppn: 0,
    pph: 0,
})

export const MAX_ROW_PERPAGE = 10
export const MAX_LIST_LENGTH = 10

export const TEMPLATE_BOUND = {
    column: 9,
    row: 36,
}
