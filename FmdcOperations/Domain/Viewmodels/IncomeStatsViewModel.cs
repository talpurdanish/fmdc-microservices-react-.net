namespace Domain.Viewmodels
{
    public class IncomeStatsViewModel
    {
        public double Todays { get; set; }
        public double Total { get; set; }
        public IList<string> Labels { get; set; } = new List<string>();
        public IList<double> Data { get; set; }= new List<double>();

    }
}
