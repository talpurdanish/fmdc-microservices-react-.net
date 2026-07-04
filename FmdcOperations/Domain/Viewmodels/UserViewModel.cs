using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using FMDC.Helpers;

namespace Domain.Viewmodels
{
    public class UserViewModel
    {
        public int Id { get; set; }

       
        [DisplayName("Name")]
        [StringLength(250, ErrorMessage = "Name should be less than 250 chars")]
        public string? Name { get; set; }

        [DisplayName("Username")]
        [StringLength(250, ErrorMessage = "Username should be less than 250 chars")]
        public string? Username { get; set; }

        [StringLength(1000, ErrorMessage = "User Name should be less than 1000 chars")]
        public string? Address { get; set; }

        [DisplayName("Picture")]
        public string Picture { get; set; } = string.Empty;

        [Required(ErrorMessage = "Date of Birth is Required")]
        [DisplayName("Date of Birth")]
        [DataType(DataType.Date), DisplayFormat(DataFormatString = "{0:dd/MM/yy}", ApplyFormatInEditMode = true)]
        public DateTime DateofBirth { get; set; }

        [Required(ErrorMessage = "Gender is Required")]
        public string? Gender { get; set; }

        [Required(ErrorMessage = "CNIC is Required")]
        [DisplayName("CNIC")]
        [RegularExpression(@"^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$", ErrorMessage = "Incorrect CNIC")]
        public string? CNIC { get; set; }

        public string? PMDCNo { get; set; }

        public DateTime Created { get; set; }

        public int CityId { get; set; }
        public string? City { get; set; }

        [DisplayName("Role")]
        public string Role { get; set; } = string.Empty;

        [DisplayName("Activated")]
        public bool? IsActive { get; set; }

        

        public int ProvinceId { get; set; }
        public string? Province { get; set; }

        public string? PhoneNo { get; set; }
        public int PhoneType { get; set; }

        
        [DisplayName("Password")]
        [MaxLength(20, ErrorMessage = "Password should be less than 20 chars")]
        [OptionalMinLength(6)]
        public string? Password { get; set; }

        public bool IsExternalAuth { get; set; }

    }
}
