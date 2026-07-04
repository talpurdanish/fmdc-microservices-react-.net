using System.ComponentModel.DataAnnotations;


namespace Domain.Models
{
    public class MedicationType
    {

        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = "";
    }
}
