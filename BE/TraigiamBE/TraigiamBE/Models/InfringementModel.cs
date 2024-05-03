namespace TraigiamBE.Models
{
    public class InfringementModel:BaseEntity
    {
        public string? Mvp {  get; set; }
        public string? NameIR { get; set; }
        public string? Desc {  get; set; }
        public long? YouthIRId { get; set; }    
        public int? Rivise { get; set; }
        public long? PunishId {  get; set; }
        public int? Dom {  get; set; }
        public int? Status { get; set; }

    }
}
