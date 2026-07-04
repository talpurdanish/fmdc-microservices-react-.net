using System.ComponentModel.DataAnnotations;

namespace Domain.Viewmodels.Users
{
    public class ChangePasswordViewModel
    {
        [Required(ErrorMessage = "UserId is required")]
        public int UserId { get; set; }
        
        [Required(AllowEmptyStrings = false, ErrorMessage = "Old Password is required")]
        [MaxLength(20, ErrorMessage = "Password should be less than 20 chars")]
        [MinLength(5, ErrorMessage = "Password should be greater that 5 chars")]
        public string Oldpassword { get; set; } = "";
        
        [Required(AllowEmptyStrings = false, ErrorMessage = "New Password is required")]
        [MaxLength(20, ErrorMessage = "Password should be less than 20 chars")]
        [MinLength(5, ErrorMessage = "Password should be greater that 5 chars")]

        public string Newpassword { get; set; } = "";
    }
}
