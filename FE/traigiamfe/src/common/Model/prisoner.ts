import { StatmentModel } from "./statement"

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
    listStatement?:StatmentModel
}

