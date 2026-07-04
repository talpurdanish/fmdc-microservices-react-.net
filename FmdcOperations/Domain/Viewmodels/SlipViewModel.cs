namespace Domain.Viewmodels
{
    public class SlipViewModel : ViewmodelBase
    {
        public string Name { get; set; } = "";
        public string FatherName { get; set; } = "";
        public string Address { get; set; } = "";
        public string DateofBirth { get; set; } = "";
        public string Gender { get; set; } = "";
        public string PhoneNo { get; set; } = "";
        public string BloodGroup { get; set; } = "";
        public string CNIC { get; set; } = "";
        public string PatientNumber { get; set; } = "";
        public string Doctor { get; set; } = "";
        public string City { get; set; } = "";
        public string Date { get; set; } = "";
        public string Age { get; set; } = "";
        public string Number { get; set; } = "";
        public IList<PrescriptionMedicationViewModel> Medstrings { get; set; } = new List<PrescriptionMedicationViewModel>();
        public IList<string> Tests { get; set; } = new List<string>();
        public string Diagnosis { get; set; } = "";
        public string Remarks { get; set; } = "";
        public string Bp { get; set; } = "";
        public double Pulse { get; set; }
        public double Bsr { get; set; }
        public double Temp { get; set; }
        public double Wt { get; set; }
        public double Ht { get; set; }
    }
}
