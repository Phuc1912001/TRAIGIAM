namespace TraigiamBE.Models
{
    public class StaffModelDto:StaffModel
    {
        public List<PrisonerModel> ListPrisoner { get; set; }
    }
}
