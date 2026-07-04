namespace Domain.Models
{
    public static class Roles
    {
        public const string Administrator = "1";
        public const string Doctor = "2";
        public const string Staff = "3";


        public static bool CheckValidity(string value)
        {
            return value != Administrator && value != Doctor && value != Staff;
        }
    }
}
