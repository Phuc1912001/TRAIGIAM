namespace TraigiamBE.Models
{
    public class InfringementModelDto:InfringementModel
    {
        public string? PrisonerName { get; set; }
        public List<PrisonerModel> ListPrisoner { get; set; }
    }
}
