using Domain.Helpers;

namespace Domain.Viewmodels.Users
{
    public class UserViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? Picture { get; set; }
        public DateTime DateofBirth { get; set; }
        public Genders Gender { get; set; } = Genders.Male;
        public string? CNIC { get; set; }
        public string? PMDCNo { get; set; }
        public DateTime Created { get; set; }
        public int CityId { get; set; } = 1;
        public string? City { get; set; }
        public Roles Role { get; set; } = Roles.Staff;
        public bool IsActive { get; set; }
        public int ProvinceId { get; set; }
        public string Province { get; set; } = string.Empty;
        public string? PhoneNo { get; set; }
        public int PhoneType { get; set; }
        public bool IsExternalAuth { get; set; }

        public double Fees { get; set; }
        public bool Status { get; set; }

    }
}
