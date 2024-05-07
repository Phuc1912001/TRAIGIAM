export interface StatmentModel {
  id?: number;
  prisonerId?: number;
  prisonerName?:string;
  irId?: number;
  irName?:string;
  statement?: string;
  timeStatement?: string;
  imageStatement?: string;
  imageSrc?: string;
  fileStatement?: any;
  status?: number;
  createdBy?: number;
  createdByName?: string;
  modifiedBy?: number;
  modifiedByName?: string;
}
