export interface VisitModel {
  id?: number;
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
