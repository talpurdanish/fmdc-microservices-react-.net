using Domain.Viewmodels;

namespace FMDC.Security
{
    public interface IJwtUtils
    {
        public string GenerateJwtToken(UserViewModel user);
        public int? ValidateJwtToken(string token);
    }
}
