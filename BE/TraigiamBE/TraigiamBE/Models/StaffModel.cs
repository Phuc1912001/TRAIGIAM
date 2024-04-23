using System.ComponentModel.DataAnnotations.Schema;

namespace TraigiamBE.Models
{
    public class StaffModel : BaseEntity
    {
        public string? StaffName { get; set; }
        public int? StaffAge { get; set; }
        public string? StaffSex { get; set; }
        public string? Cccd { get; set; }
        public string? Mnv {  get; set; } 
        public string Position { get; set; }
        public string? Countryside { get; set; }
        public int? IsActive { get; set; }
        public string? ImageStaff { get; set; }

        [NotMapped]
        public IFormFile? FileStaff { get; set; }

        [NotMapped]
        public string? ImageSrc { get; set; }
    }
}
