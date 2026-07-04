using Domain.Helpers;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Domain.Viewmodels.Users
{
    public class CreateUserViewModel
    {
        
        [Required(ErrorMessage = "Name is required")]
        [StringLength(250, ErrorMessage = "Name should be less than 250 chars")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Username is required")]
        [StringLength(250, ErrorMessage = "Username should be less than 250 chars")]
        public string Username { get; set; } = string.Empty;

        [StringLength(1000, ErrorMessage = "Address should be less than 1000 chars")]
        public string? Address { get; set; }

        public string? Picture { get; set; }

        [Required(ErrorMessage = "Date of Birth is Required")]
        [DisplayName("Date of Birth")]
        [DataType(DataType.Date), DisplayFormat(DataFormatString = "{0:dd/MM/yy}", ApplyFormatInEditMode = true)]
        public DateTime DateofBirth { get; set; }

        [Required(ErrorMessage = "Gender is Required")]
        public Genders Gender { get; set; } = Genders.Male;

        [Required(ErrorMessage = "CNIC is Required")]
        [RegularExpression(@"^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$", ErrorMessage = "CNIC is not valid")]
        public string CNIC { get; set; } = string.Empty;

        [Required(ErrorMessage = "PMDC no is Required")]
        [DisplayName("PMDC no")]
        public string PMDCNo { get; set; } = string.Empty;
        public int CityId { get; set; } = 1;
        
        [DisplayName("Role")]
        public Roles Role { get; set; } = Roles.Staff;
        public string? PhoneNo { get; set; }
        public int PhoneType { get; set; }

    }
}
