namespace Domain.Viewmodels
{
    public class PatientStatViewModel(int patients, int males, int females, int others)
    {

        public int Patients { get; set; } = patients;
        public int Males { get; set; } = males;
        public int Females { get; set; } = females;
        public int Others { get; set; } = others;
    }
}
