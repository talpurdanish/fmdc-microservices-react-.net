using System.ComponentModel.DataAnnotations;

namespace Domain.Viewmodels
{
    public class ReceiptViewModel : ViewmodelBase
    {
        public int Id { get; set; }

        public string ReceiptNumber { get; set; } = "";

        [Required(ErrorMessage = "Patient Id is Required")]
        public int PatientId { get; set; }

        [Required(ErrorMessage = "Doctor Id is Required")]
        public int DoctorId { get; set; }

        [Required(ErrorMessage = "Doctor Id is Required")]
        public int AppointmentId { get; set; }

        public string PatientName { get; set; } = "";
        public string PatientNumber { get; set; } = "";

        public string Doctor { get; set; } = "";

        public string Date { get; set; } = "";
        public string Time { get; set; } = "";



        public string AuthorizedBy { get; set; } = "";
        public int AuthorizedById { get; set; }

        public double Discount { get; set; }
        public double Total { get; set; }
        public double GrandTotal { get; set; }

        public string Appointment { get; set; } = "";

        public bool Paid { get; set; }
        public List<ProcedureViewModel> Procedures { get; set; } = [];

        public List<TestViewModel> Tests { get; set; } = [];

        public List<ReceiptDetailViewModel> Items { get; set; } = [];


        public List<int> ProceduresIds { get; set; } = [];
        public List<int> TestsIds { get; set; } = [];

    }

    public enum DetailType
    {
        procedure, test
    }
}
