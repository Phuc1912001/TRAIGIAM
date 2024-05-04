import { PrisonerModel } from "./prisoner";

export interface InfringementModel {
  id?: number;
  mvp?: string;
  nameIR?: string;
  location?: string;
  timeInfringement?: string;
  desc?: string;
  YouthIRIds?: number[];
  rivise?: number;
  punishId?: number;
  status?: number;
  createdBy?: number;
  createdByName?: string;
  modifiedBy?: number;
  modifiedByName?: string;
}

export interface InfringementResponse {
  id?: number;
  mvp?: string;
  nameIR?: string;
  location?: string;
  timeInfringement?: string;
  desc?: string;
  YouthIRIds?: number[];
  rivise?: number;
  punishId?: number;
  status?: number;
  createdBy?: number;
  createdByName?: string;
  modifiedBy?: number;
  modifiedByName?: string;
  prisonerName?:string;
  listPrisoner?: PrisonerModel[]
}
