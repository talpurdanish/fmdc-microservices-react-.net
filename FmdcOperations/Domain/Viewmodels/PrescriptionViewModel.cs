using Domain.Models;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Domain.Viewmodels
{
    public class PrescriptionViewModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int AppointmentId { get; set; }
        public string Date { get; set; } = "";

        public string PatientName { get; set; } = "";
        public string PatientNumber { get; set; } = "";
        public int PatientId { get; set; }

        public string StartTime { get; set; } = "";
        public int DoctorId { get; set; }

        public string Doctor { get; set; } = "";

        public string MedString { get; set; } = "";
        public IList<PrescriptionMedicationViewModel> Medstrings { get; set; } = new List<PrescriptionMedicationViewModel>();
        public IList<string> Tests { get; set; } = new List<string>();
        public string Diagnosis { get; set; } = "";
        public string Remarks { get; set; } = "";

        public string Bp { get; set; }= string.Empty;
        public double Pulse { get; set; }
        public double Bsr { get; set; }
        public double Temp { get; set; }
        public double Wt { get; set; }
        public double Ht { get; set; }
       
    }
}
