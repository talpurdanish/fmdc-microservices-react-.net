using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Domain.Viewmodels
{
    public class CreateLabReportViewModel
    {
        [Required]
        [DisplayName("Delivery Date")]
        public string ReportDeliveryDate { get; set; } = "";
        [Required]
        [DisplayName("Delivery Time")]
        public string ReportDeliveryTime { get; set; } = "";
        [Required]
        [DisplayName("Test")]
        public int TestId { get; set; }
        [Required]
        [DisplayName("Patient")]
        public int PatientId { get; set; }
        [Required]
        [DisplayName("Doctor")]
        public int DoctorId { get; set; }

    }
}
