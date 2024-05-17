import { BedModel, BedModelResponse } from "./bed";

export interface RoomModel {
    id?:number;
    roomName?:string;
    domId?:number;
}

export interface RoomModelResponse {
    id?:number;
    roomName?:string;
    domId?:number;
    listBed?:BedModelResponse[]
}