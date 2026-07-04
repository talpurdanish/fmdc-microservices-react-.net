namespace Domain.Viewmodels
{
    public class PatientButtons
    {

        public bool StartVisible { get; set; } = true;
        public bool EndVisible { get; set; }
        public bool ReceiptVisible { get; set; }
        public string Title { get; set; } = "";
        public int PatientId { get; set; }
        public int AId { get; set; }
        public bool PrescriptionVisible { get; set; }

        public bool SlipVisible { get; set; }

    }
}
