export interface PrisonerModel {
    id?: number,
    prisonerName?:string,
    prisonerAge?:string,
    prisonerSex?:string,
    cccd?:string,
    mpn?:string,
    bandingID?:number,
    dom?:number,
    bed?:number,
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
    dom?:number,
    bed?:number,
    countryside?:string,
    crime?:string,
    years?:number,
    mananger?:number,
    manangerName?:string,
    imagePrisoner?:string,
    imageSrc?:string
    filePrisoner?:any,
    isActiveBanding:boolean
}

