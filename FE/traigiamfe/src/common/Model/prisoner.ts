import { CheckInCheckOutModel } from "./checkincheckout"
import { InfringementModel } from "./infringement"
import { StatmentModel } from "./statement"
import { VisitModel } from "./visit"

export interface PrisonerModel {
    id?: number,
    prisonerName?:string,
    prisonerAge?:string,
    prisonerSex?:string,
    cccd?:string,
    mpn?:string,
    bandingID?:number,
    domId?:number,
    roomId?:number,
    bedId?:number,
    countryside?:string,
    crime?:string,
    years?:number,
    mananger?:number,
    manangerName?:string,
    imagePrisoner?:string,
    imageSrc?:string
    filePrisoner?:any
}

export interface PrisonerResponse {
    id?: number,
    prisonerName?:string,
    prisonerAge?:string,
    prisonerSex?:string,
    cccd?:string,
    mpn?:string,
    bandingID?:number,
    domId?:number,
    roomId?:number,
    bedId?:number,
    domName?:string,
    roomName?:string,
    bedName?:string,
    countryside?:string,
    crime?:string,
    years?:number,
    mananger?:number,
    manangerName?:string,
    imagePrisoner?:string,
    imageSrc?:string
    filePrisoner?:any,
    isActiveBanding?:boolean,
    listStatement?:StatmentModel[],
    listExternal?: CheckInCheckOutModel[],
    listVisit?:VisitModel[],
    listInfingement?: InfringementModel[]
}

