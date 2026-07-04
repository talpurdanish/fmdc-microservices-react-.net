
using Domain.Helpers;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(250)]
        [NotNull]
        public string Name { get; set; } = string.Empty;
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public string? PMDCNo { get; set; }
        public string? Address { get; set; }
        public byte[]? Picture { get; set; }
        public Genders Gender { get; set; } = Genders.Male;
        public string? PhoneNo { get; set; }
        public int? PhoneType { get; set; }
        public DateTime? DateofBirth { get; set; }
        public string? CNIC { get; set; }
        public int CityId { get; set; }
        public virtual City? City { get; set; }
        [Required]
        public string Username { get; set; } = string.Empty;
        public string? Password { get; set; }
        public string? PasswordSalt { get; set; }
        [Required]
        public Roles Role { get; set; } = Roles.Staff;
        public bool IsActive { get; set; }
        public bool IsExternalAuth { get; set;  }

        public double Fees { get; set; }
    }

    
}
