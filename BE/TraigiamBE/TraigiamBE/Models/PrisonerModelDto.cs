namespace TraigiamBE.Models
{
    public class PrisonerModelDto:PrisonerModel
    {
        public bool? IsActiveBanding {  get; set; } 
        public List<StatementModelDto>? ListStatement { get; set; }
        public string? DomName { get; set; }
        public string? RoomName { get; set; }
        public string? BedName { get; set; }

        public List<ExternalModelDto> ListExternal { get; set; }
        public List<VisitModelDto> ListVisit { get; set; }
        public List<InfringementModelDto> ListInfringement { get; set; }
    }
}
