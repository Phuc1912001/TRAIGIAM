namespace TraigiamBE.Models
{
    public class DomModel:BaseEntity
    {
        public long? DomGenderId { get; set; }
        public string? DomName { get; set; }
        public long? PrisonerId { get; set; }
    }
}
