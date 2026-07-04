namespace Domain.Models
{
    public class PrescriptionMedication
    {
        public int Id { get; set; }

        public double Quantity { get; set; }
        public string Units { get; set; } = "";
        public int Times { get; set; }

        public int Days { get; set; }

        public int MedicationCode { get; set; }
        public int PrescriptionId { get; set; }

        public virtual Medication? Medication { get; set; }
        

    }
}
