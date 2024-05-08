namespace TraigiamBE.Models
{
    public class StaffModelDto:StaffModel
    {
        public List<PrisonerModelDto> ListPrisoner { get; set; }
    }
}
