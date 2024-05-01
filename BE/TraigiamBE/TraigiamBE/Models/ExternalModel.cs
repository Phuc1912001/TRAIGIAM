namespace TraigiamBE.Models
{
    public class ExternalModel : BaseEntity
    {
        public int? PrisonerId { get; set; }
        public string? Emtype { get; set; }
        public string? Desc { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? Status { get; set; } = 0;
        public int? CreatedBy { get; set; }
        public string? CreatedByName { get; set; }
        public int? ModifiedBy { get; set; }
        public string? ModifiedByName { get; set; }
    }
}
