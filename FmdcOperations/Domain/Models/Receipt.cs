using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class Receipt
    {
        [Key]
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Time { get; set; } = "";
        public double Discount { get; set; }
        public int AuthorizedById { get; set; }
        public bool Paid { get; set; }
        public int AppointmentId { get; set; }
        public virtual Appointment? Appointment { get; set; }

        [Required]
        public int UserId { get; set; }
        [Required]
        public int PatientId { get; set; }

        public double GrandTotal { get; set; }
        public double Total { get; set; }
        public string StripePaymentIntentId { get; set; } = string.Empty;

        public DateTime? PaidAt {get; set;}

        

    }
}
