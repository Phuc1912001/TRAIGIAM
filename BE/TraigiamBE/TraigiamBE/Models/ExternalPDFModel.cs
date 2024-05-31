namespace TraigiamBE.Models
{
    public class ExternalPDFModel:ExternalModel
    {
        public long? PrisonerId { get; set; }
        public long? RecordId { get; set; }
        public string? FileName { get; set; }
    }
}
