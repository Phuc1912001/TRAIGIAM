import { PrisonerModel } from "./prisoner";

export interface BedModel {
    id?:number;
    bedName?:string;
    roomId?:number;
    domId?:number;
}

export interface BedModelResponse {
    id?:number;
    bedName?:string;
    roomId?:number;
    domId?:number;
    prisonerBed?:PrisonerModel;
}