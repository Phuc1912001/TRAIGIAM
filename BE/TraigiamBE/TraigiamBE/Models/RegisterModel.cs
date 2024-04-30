namespace TraigiamBE.Models
{
    public class RegisterModel:BaseEntity
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public int? Role { get; set; }
    }
}
