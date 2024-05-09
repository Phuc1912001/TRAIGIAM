namespace TraigiamBE.Models
{
    public class BedModel:BaseEntity
    {
        public string? BedName { get; set; }
        public long? RoomId { get; set; }
        public long? DomId { get; set; }
    }
}
