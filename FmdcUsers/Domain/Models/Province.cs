using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class Province
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(250)]
        public string Name { get; set; } =  string.Empty;

        public virtual ICollection<City> Cities { get; set; } = [];
    }
}
