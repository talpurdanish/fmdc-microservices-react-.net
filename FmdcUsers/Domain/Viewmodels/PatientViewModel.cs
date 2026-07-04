using Domain.Helpers;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Domain.Viewmodels
{
    public class PatientViewModel
    {

        public int Id { get; set; }

        [Required(ErrorMessage = "Patient Name is Required")]
        [DisplayName("Patient Name")]
        [StringLength(250, ErrorMessage = "Patient Name should be less than 250 chars")]
        public string Name { get; set; } = "";
        [DisplayName("Father / Husband Name")]
        [StringLength(250, ErrorMessage = "Patient Name should be less than 250 chars")]
        public string? FatherName { get; set; }

        [StringLength(1000, ErrorMessage = "Patient Name should be less than 1000 chars")]
        public string? Address { get; set; }

        [DisplayName("Picture")]
        public string? Picture { get; set; }

        [Required(ErrorMessage = "Date of Birth is Required")]
        [DisplayName("Date of Birth")]
        [DataType(DataType.Date), DisplayFormat(DataFormatString = "{0:dd/MM/yy}", ApplyFormatInEditMode = true)]
        public DateTime DateofBirth { get; set; }

        [Required(ErrorMessage = "Gender is Required")]
        public Genders Gender { get; set; } = Genders.Male;

        [StringLength(15, ErrorMessage = "Incorrect Number")]
        public string? PhoneNo { get; set; }
        public int? PhoneType { get; set; }

        [Required(ErrorMessage = "BloodGroup is Required")]
        public string BloodGroup { get; set; } = "";


        [Required(ErrorMessage = "CNIC is Required")]
        [DisplayName("CNIC")]
        [RegularExpression(@"^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$", ErrorMessage = "Incorrect CNIC")]
        public string CNIC { get; set; } = "";

        public string PatientNumber { get; set; } = "";

        public int MrNo {get; set; }

        public DateTime Created { get; set; }

        public int CityId { get; set; }
        public string City { get; set; } = "";
        public string Province { get; set; } = "";

        public int ProvinceId { get; set; }
       

    }
}
