namespace TraigiamBE.Models
{
    public class PrisonerModelDto:PrisonerModel
    {
        public bool? IsActiveBanding {  get; set; } 
        public List<StatementModelDto>? ListStatement { get; set; }
    }
}
