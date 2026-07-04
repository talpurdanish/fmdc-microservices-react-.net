


namespace Domain.Viewmodels
{
    public class ReportViewModel
    {
        //public WebReport WebReport { get; set; }
        public int ReportId { get; set; }
        public bool Paid { get; set; }
        public string Title { get; internal set; } = "";
    }
}
