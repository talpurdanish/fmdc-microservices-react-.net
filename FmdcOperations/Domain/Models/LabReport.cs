
using Domain.Viewmodels;

namespace Domain.Models
{
    public class LabReport
    {
        public int Id { get; set; }
        public DateOnly ReportDate { get; set; }
        public TimeOnly ReportTime { get; set; }
        public DateOnly ReportDeliveryDate { get; set; }
        public TimeOnly ReportDeliveryTime { get; set; }
        public int TestId { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public int ReportNumber { get; set; }
        public string Note { get; set; } = "";
        public int? PrescriptionId { get; set; }
        public virtual Test? Test { get; set; }

         public bool Status { get; set; }
    }
}
