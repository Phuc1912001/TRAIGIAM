import { BedModelResponse } from "./bed";

export interface RoomModel {
  id?: number;
  roomName?: string;
  domId?: number;
  domGenderId?: number;
  domGenderName?: string;
}

export interface RoomModelResponse {
  id?: number;
  roomName?: string;
  domId?: number;
  listBed?: BedModelResponse[];
  domGenderId?: number;
  domGenderName?: string;
  domName?: string;
}
