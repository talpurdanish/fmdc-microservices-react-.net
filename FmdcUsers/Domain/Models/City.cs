using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class City
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(300)]
        public string Name { get; set; } = string.Empty;
        [Required]
        public int ProvinceId { get; set; }
        public virtual Province? Province { get; set; }
    }
}
