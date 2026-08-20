import { type FormInputProps, DivisionSchema, FormInput } from "@/app/props/sptjb"
import * as z from "zod"
import employees from "@/../data/employees.json"
import variables from "@/app/data/variables.json"
import { dateTZ } from "@/app/lib/date-timezone"
import { v4 as uuidv4 } from "uuid"

export const SupervisorType = z.enum(variables.supervisor).default("Kasubbagbin")
export type Supervisor = z.infer<typeof SupervisorType>

export const EmployeeBasic = z.object({
    employeeId: z.string().default(""),
    name: z.string().default(""),
    position: z.string().default(""),
    phone: z.string().default(""),
    gender: z.enum(Object.keys(variables.gendermap)).nullable().default(null),
    rank: z.string().default(""),
    class: z.enum(variables.class).nullable().default(null),
    room: z.enum(variables.room).nullable().default(null),
})

export type EmployeeBasicProps = z.infer<typeof EmployeeBasic>

export interface EmployeeProps extends EmployeeBasicProps {
    genderId: number
    classId: number
    roomId: number
}

export const Employee = z.object({
    ...EmployeeBasic.shape,
    genderId: z.number().default(0),
    classId: z.number().default(0),
    roomId: z.number().default(0),
})

export const EmployeePicketData = z.object({
    employeeId: EmployeeBasic.shape.employeeId,
    name: EmployeeBasic.shape.name,
    gender: z.string().default(variables.gender[0]),
    phone: z.string().default(""),
    category: z.string().default(""),
})

export type EmployeePicketDataProps = z.infer<typeof EmployeePicketData>

export const TodayEmployeePicket = z.object({
    first: EmployeePicketData,
    second: EmployeePicketData,
})

export type TodayEmployeePicketProps = z.infer<typeof TodayEmployeePicket>

export const EmployeePicket = z.object({
    id: z.string().default(uuidv4()),
    employees: TodayEmployeePicket,
    supervisor: z.enum(variables.supervisor).default("Kasubbagbin"),
    schedule: z.coerce.date().default(() => dateTZ.nowDate()),
})

export type EmployeePicketProps = z.infer<typeof EmployeePicket>

export const Picket = z.object({
    id: z.string().default(uuidv4()),
    pickets: z.array(EmployeePicket).default([]),
    startAt: z.coerce.date().default(() => dateTZ.nowDate()),
    endAt: z.coerce.date().default(() => dateTZ.nowDate()),
    generatedAt: z.coerce.date().default(() => dateTZ.nowDate()),
})

export type PicketProps = z.infer<typeof Picket>

export const SPTJB = z.object({
    id: z.string().default(uuidv4()),
    docId: z.string().default(""),
    name: z.string().default(""),
    division: DivisionSchema,
    _class: z.string().default(""),
    createdAt: z.coerce.date().default(() => dateTZ.nowDate()),
    updatedAt: z.coerce.date().default(() => dateTZ.nowDate()),
})

export type SPTJBProps = z.infer<typeof SPTJB>

export interface SPTJBDetailProps extends SPTJBProps {
    data: FormInputProps[]
}

export const SPTJBDetail = z.object({
    ...SPTJB.shape,
    data: z.array(FormInput).default([]),
})

export const DataBase = z.object({
    employees: z.array(Employee).default([]),
    pickets: z.array(Picket).default([]),
    sptjb: z.array(SPTJBDetail).default([]),
})

export type DataBaseProps = z.infer<typeof DataBase>

export const DEFAULT_DATA = DataBase.parse({
    employees: employees.map((employee) =>
        Employee.parse({
            employeeId: employee.employeeid,
            name: employee.name,
            position: employee.position,
            phone: employee.phone,
            gender: employee.gender,
            genderId: employee.genderid,
            rank: employee.rank,
            class: employee.class,
            classId: employee.classid,
            room: employee.room,
            roomId: employee.roomid,
        })
    ),
    pickets: [],
    sptjb: [],
})
