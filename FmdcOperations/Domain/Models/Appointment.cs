using System.ComponentModel.DataAnnotations;


namespace Domain.Models
{
    public class Appointment
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public TimeOnly StartTime { get; set; }
        public DateTime? EndDate { get; set; }
        public TimeOnly? EndTime { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public int PatientId { get; set; }

        public int? ReceiptId { get; set; }


    }
}
