namespace TraigiamBE.Models
{
    public class InfringementModelDto:InfringementModel
    {
        public string? PrisonerName { get; set; }
        public string? PunishName { get; set; }
        public List<PrisonerModel> ListPrisoner { get; set; }
        public List<PrisonerModelDto> ListPrisonerStatement { get; set; }
    }
}
