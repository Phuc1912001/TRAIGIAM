import { PrisonerResponse } from "./prisoner";

export interface StaffModel {
  id?: number;
  staffName?: string;
  staffAge?: number;
  staffSex?: string;
  cccd?: string;
  mnv?: string;
  position?: string;
  countryside?: string;
  isActive?: boolean;
  imageStaff?: string;
  imageSrc?: string;
  fileStaff?: A;
}

export interface StaffModelDetail {
  id?: number;
  staffName?: string;
  staffAge?: number;
  staffSex?: string;
  cccd?: string;
  mnv?: string;
  position?: string;
  countryside?: string;
  isActive?: boolean;
  imageStaff?: string;
  imageSrc?: string;
  fileStaff?: A;
  listPrisoner?: PrisonerResponse[];
}
