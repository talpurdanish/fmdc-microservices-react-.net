
using Domain.Models;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace Domain.Viewmodels
{
    public class LabReportViewModel : ViewmodelBase
    {

        public int Id { get; set; }

        [DisplayName("Date")]
        public string ReportDate { get; set; } = "";
        [DisplayName("Time")]
        public string ReportTime { get; set; } = "";
        [Required]
        [DisplayName("Delivery Date")]
        public string ReportDeliveryDate { get; set; } = "";
        [Required]
        [DisplayName("Delivery Time")]
        public string ReportDeliveryTime { get; set; } = "";
        public string TestName { get; set; } = "";
        [Required]
        [DisplayName("Test")]
        public int TestId { get; set; }
        [Required]
        [DisplayName("Patient")]
        public int PatientId { get; set; }
        public string PatientName { get; set; } = "";
        public string PatientNumber { get; set; } = "";

        public string Doctor { get; set; } = "";

        [Required]
        [DisplayName("Doctor")]
        public int DoctorId { get; set; }

        public int ReportNumber { get; set; }
        public string ReportNoString { get; set; } = "";

        public string Status { get; set; } = "";

        public string PatientAge { get; set; } = "";
        public string PatientGender { get; set; } = "";

        public string DoctorPMDCNo { get; set; } = "";

        public string Note { get; set; } = "";

        public int? PrescriptionId { get; set; }

        public IList<TestParameterViewModel> TestParameters { get; set; } = [];

    }
}
