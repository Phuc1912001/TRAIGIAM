using System.ComponentModel.DataAnnotations.Schema;

namespace TraigiamBE.Models
{
    public class StatementModel:BaseEntity
    {
        public long? PrisonerId { get; set; }
        public string? Statement { get; set; }
        public long? IrId { get; set; }
        public string? ImageStatement { get; set; }
        public DateTime? TimeStatement { get; set; }
        public int? Status { get; set; }

        public long? CreatedBy { get; set; }
        public string? CreatedByName { get; set; }
        public long? ModifiedBy { get; set; }
        public string? ModifiedByName { get; set; }

        [NotMapped]
        public IFormFile? FileStatement { get; set; }

        [NotMapped]
        public string? ImageSrc { get; set; }
    }
}
