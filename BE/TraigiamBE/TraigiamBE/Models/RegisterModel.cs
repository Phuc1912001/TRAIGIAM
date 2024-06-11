using System.ComponentModel.DataAnnotations.Schema;

namespace TraigiamBE.Models
{
    public class RegisterModel:BaseEntity
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }

        public string? PhoneNumber {  get; set; } 

        public int? Role { get; set; }

        public string? ImageUser { get; set; }

        [NotMapped]
        public IFormFile? FileUser { get; set; }

        [NotMapped]
        public string? ImageSrc { get; set; }
    }
}
