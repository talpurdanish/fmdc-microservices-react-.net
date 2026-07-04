using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class Medication
    {

        [Key]
        public int Code { get; set; }
        [Required]
        [MaxLength(1000)]
        public string Name { get; set; } = "";
        [Required]
        [MaxLength(1000)]
        public string Brand { get; set; } = "";
        public string Description { get; set; } = "";

        public int MedicationTypeId { get; set; }
        public virtual MedicationType? MedicationType { get; set; }
    }
}
