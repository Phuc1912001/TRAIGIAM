using System.ComponentModel.DataAnnotations.Schema;

namespace TraigiamBE.Models
{
    public class InfringementModel:BaseEntity
    {
        public string? Mvp {  get; set; }
        public string? NameIR { get; set; }
        public string? Location {  get; set; }
        public DateTime? TimeInfringement { get; set; }

        public string? Desc {  get; set; }
        [NotMapped]
        public List<long>? YouthIRIds { get; set; }
        public int? Rivise { get; set; }
        public long? PunishId {  get; set; }
        public int? Status { get; set; }
        public int? CreatedBy { get; set; }
        public string? CreatedByName { get; set; }
        public int? ModifiedBy { get; set; }
        public string? ModifiedByName { get; set; }

    }
}
