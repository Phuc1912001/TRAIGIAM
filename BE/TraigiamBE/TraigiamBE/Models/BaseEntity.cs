using System.ComponentModel.DataAnnotations;

namespace TraigiamBE.Models
{
    public class BaseEntity
    {
        [Key]
        public long Id { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public DateTime UpdateAt { get; set; } = DateTime.Now;
    }
}
