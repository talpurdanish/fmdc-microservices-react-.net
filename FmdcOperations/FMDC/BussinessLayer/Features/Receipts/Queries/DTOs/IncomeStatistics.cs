namespace FMDC.BussinessLayer.Features.Receipts.Queries.DTOs
{
    public class IncomeStatistics
    {
        public double Todays { get; set; }
        public double Total { get; set; }
        public IList<string> Labels { get; set; } = [];
        public IList<double> Data { get; set; } = [];
    }
}
