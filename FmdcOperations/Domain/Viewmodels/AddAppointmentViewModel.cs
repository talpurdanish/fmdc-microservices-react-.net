namespace Domain.Viewmodels
{
    public class AddAppointmentViewModel
    {
        public int PatientId{ get; set;}
        public int UserId{ get; set;}
    }

    public class AppointStatViewModel{ 
        public int Pending{ get; set;}
        public int Total{ get; set;}
        public int TodaysPending{ get; set;}
        public int TodaysTotal{ get; set;}


        }
}
