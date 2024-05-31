export interface PdfModelVisit {
  id?: number;
  prisonerId?: number;
  recordId?: number;
  fileName?: string;
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
