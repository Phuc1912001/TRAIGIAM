namespace TraigiamBE.Models
{
    public class PunishmentModel:BaseEntity
    {
        public string? PunishName {  get; set; }
        public string? Desc {  get; set; }
        public bool? Status { get; set; }
    }
}
