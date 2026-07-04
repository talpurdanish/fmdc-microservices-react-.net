namespace Domain.Viewmodels
{
    public class AppointmentStatViewModel
    {
         public AppointmentStatViewModel(int tpending, int ttotal, int pending, int total)
        {
            Total = total;
            Pending = pending; 
            TodayPending= tpending;
            TodayTotal= ttotal;
        }

        public int Total { get; set; }
        public int Pending { get; set; }
        public int TodayTotal { get; set; }
        public int TodayPending { get; set; }

    }
}
