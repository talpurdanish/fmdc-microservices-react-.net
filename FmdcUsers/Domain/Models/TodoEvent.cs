using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class TodoEvent
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(500, ErrorMessage ="Title could be 500 chars long")]
        public string Title { get; set; } = "";
        public DateTime Created { get; set; }
        public bool Completed { get; set; }
        [Required]
        public int UserId { get; set; }

        public virtual User? User { get; set; }
    }
}
