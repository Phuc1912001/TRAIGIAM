namespace TraigiamBE.Models
{
    public class RoomModelDto:RoomModel
    {
        public List<BedModelDto>? ListBed { get; set; }
        public string? DomGenderName { get; set; }
        public string? DomName { get; set; }

    }
}
