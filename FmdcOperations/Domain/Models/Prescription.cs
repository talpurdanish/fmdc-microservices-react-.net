using Domain.Viewmodels;

namespace Domain.Models
{
    public class Prescription
    {
        public int Id { get; set; }
        public int AppointmentId { get; set; }
        public string Diagnosis { get; set; } = "";
        public string Remarks { get; set; } = "";

        public string Bp { get; set; } = string.Empty;
        public double Pulse { get; set; }
        public double Bsr { get; set; }
        public double Temp { get; set; }
        public double Wt { get; set; }
        public double Ht { get; set; }

        public virtual IList<PrescriptionMedication> PrescriptionMedications { get; set; } = [];
        public virtual IList<Test> Tests { get; set; } = [];
        public virtual Appointment? Appointment { get; set; }

    }
}
