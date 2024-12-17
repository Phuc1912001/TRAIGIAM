namespace TraigiamBE.Models
{
    public class ModelPDF:VisitModelDto
    {
        public long? PrisonerId { get; set; }
        public long? RecordId { get; set; }
        public string? FileName { get; set; }
        
    }
}
