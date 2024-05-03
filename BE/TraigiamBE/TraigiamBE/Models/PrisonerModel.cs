using System.ComponentModel.DataAnnotations.Schema;

namespace TraigiamBE.Models
{
    public class PrisonerModel:BaseEntity
    {
        public string? PrisonerName { get; set; }
        public string? PrisonerAge { get; set; }
        public string? PrisonerSex { get; set; }
        public string? Cccd { get; set; }
        public string? Mpn { get; set; }
        public long? BandingID { get; set; }
        public int? Dom {  get; set; }
        public int? Bed { get; set; }
        public string? Countryside { get; set; }
        public string? Crime { get; set; }

        public int? Years { get; set; }

        public long? Mananger { get; set; }
       
        [Column(TypeName = "nvarchar(100)")]

        public string? ImagePrisoner { get; set; }

        [NotMapped]
        public string? ManangerName { get; set; }

        [NotMapped] 
        public IFormFile? FilePrisoner { get; set; }

        [NotMapped]
        public string? ImageSrc { get; set; }

     }
}
