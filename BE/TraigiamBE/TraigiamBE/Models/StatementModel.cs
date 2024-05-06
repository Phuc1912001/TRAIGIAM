using System.ComponentModel.DataAnnotations.Schema;

namespace TraigiamBE.Models
{
    public class StatementModel:BaseEntity
    {
        public long? PrisonerId { get; set; }
        public string? Statement { get; set; }
        public long? IrId { get; set; }
        public string? ImageStatement { get; set; }

        [NotMapped]
        public IFormFile? FileStatement { get; set; }

        [NotMapped]
        public string? ImageSrc { get; set; }
    }
}
