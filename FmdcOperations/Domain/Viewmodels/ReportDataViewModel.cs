namespace Domain.Viewmodels
{
    public class ReportDataViewModel
    {
        public int Id { get; set; }

        public string ReportDate { get; set; } = "";
        public string ReportTime { get; set; } = "";
        public string ReportDeliveryDate { get; set; } = "";
        public string ReportDeliveryTime { get; set; } = "";
        public string TestName { get; set; } = "";
        public string PatientName { get; set; } = "";
        public string PatientNumber { get; set; } = "";
        public string PatientAge { get; set; } = "";
        public string PatientGender { get; set; } = "";

        public string DoctorPMDCNo { get; set; } = "";
        public string Doctor { get; set; } = "";

        public IList<ReportValueViewModel> ReportValues { get; set; } = new List<ReportValueViewModel>();


        public string ParameterName { get; set; } = "";
        public double ParameterMaleMaxValue { get; set; }
        public double ParameterMaleMinValue { get; set; }
        public double ParameterFemaleMaxValue { get; set; }
        public double ParameterFemaleMinValue { get; set; }
        public string ParameterUnit { get; set; } = "";
        public double ParameterValue { get; set; }
        public string ParameterReferenceRange { get; set; } = "";
        public bool ParameterGender { get; set; }


        public int ReportNumber { get; set; }
        public string Status { get; set; } = "";


    }
}
