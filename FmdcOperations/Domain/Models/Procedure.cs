using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class Procedure
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = "";
        public double Cost { get; set; }

        
        public int ProcedureTypeId { get; set; }

        public virtual ProcedureType? ProcedureType { get; set; }
    }
}
