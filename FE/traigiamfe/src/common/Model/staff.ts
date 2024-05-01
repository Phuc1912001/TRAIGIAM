import { PrisonerModel } from "./prisoner"

export interface StaffModel {
    id?:number,
    staffName?:string,
    staffAge?: number,
    staffSex?:string,
    cccd?:string,
    mnv?:string,
    position?:string,
    countryside?:string,
    isActive?:boolean,
    imageStaff?:string,
    imageSrc?:string,
    fileStaff?:any
}

export interface StaffModelDetail {
    id?:number,
    staffName?:string,
    staffAge?: number,
    staffSex?:string,
    cccd?:string,
    mnv?:string,
    position?:string,
    countryside?:string,
    isActive?:boolean,
    imageStaff?:string,
    imageSrc?:string,
    fileStaff?:any,
    ListPrisoner?:PrisonerModel[]
}