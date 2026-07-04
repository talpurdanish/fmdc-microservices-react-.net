namespace Domain.Viewmodels
{
    public class IncomeStatViewModel
    {
        public double Total{ get; set;}
        public double Todays{get; set;}
        public IList<string> Labels{ get; set;} = Array.Empty<string>();
        public IList<double> Data{ get; set;} = Array.Empty<double>();

    }
}
