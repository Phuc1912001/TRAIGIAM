namespace TraigiamBE.Models
{
    public class RoomModel:BaseEntity
    {
        public string? RoomName { get; set; }
        public long? DomId { get; set; }
        public long? DomGenderId { get; set; }

        public long? PrisonerId { get; set; }
    }
}
