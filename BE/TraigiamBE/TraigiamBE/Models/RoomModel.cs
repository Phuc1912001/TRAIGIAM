namespace TraigiamBE.Models
{
    public class RoomModel:BaseEntity
    {
        public string? BedName { get; set; }
        public long? RoomId { get; set; }
        public long? DomId { get; set; }
    }
}
