using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Domain.Viewmodels.Users
{
    public class LoginViewModel
    {
        [Required(AllowEmptyStrings =false, ErrorMessage ="Username is required")]
        public string Username{get; set; } = string.Empty;

        [Required(AllowEmptyStrings = false, ErrorMessage = "Password is required")]
        [MaxLength(20, ErrorMessage = "Password should be less than 20 chars")]
        [MinLength(5, ErrorMessage = "Password should be greater that 5 chars")]
        public string Password{get; set; } = string.Empty;
    }

    public class GoogleTokenModel {

        public string GoogleToken { get; set; } = string.Empty;
    }
}
