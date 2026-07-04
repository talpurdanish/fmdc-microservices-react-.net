using Domain.Helpers;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    [Index(nameof(CNIC), IsUnique = true)]
    public class Patient
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string PatientNumber { get; set; } = "";
        [Required]
        [MaxLength(250)]
        public string Name { get; set; } = "";
        [Required]
        [MaxLength(250)]
        public string FatherName { get; set; } = "";
        public DateTime Created { get; set; } = DateTime.UtcNow;
        [MaxLength(1000)]
        public string? Address { get; set; }
        public byte[]? Picture { get; set; }
        [Required]
        public Genders Gender { get; set; } = Genders.Male;
        public int? PhoneType{ get; set; }
        public string? PhoneNo { get; set; }
        public string? BloodGroup { get; set; }
        [Required]
        public DateTime DateofBirth { get; set; }
        [Required]
        public string CNIC { get; set; } = "";
        [Required]
        public int CityId { get; set; }
        public virtual City? City { get; set; }
        public int MRNoID { get; set; }
    }
}