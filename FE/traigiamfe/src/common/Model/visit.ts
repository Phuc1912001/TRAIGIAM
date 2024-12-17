export interface VisitModel {
  id?: number;
  familyName?: string;
  familyPhone?: string;
  familyAddress?: string;
  prisonerId?: number;
  prisonerName?: string;
  typeVisit?: number;
  startDate?: string;
  endDate?: string;
  desc?: string;
  status?: number;
  createdBy?: number;
  createdByName?: string;
  modifiedBy?: number;
  modifiedByName?: string;
}
