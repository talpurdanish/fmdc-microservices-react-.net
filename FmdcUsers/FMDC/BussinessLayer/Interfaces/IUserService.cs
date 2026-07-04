using Domain.Helpers;
using Domain.Viewmodels.Users;


namespace FMDC.BussinessLayer.Interfaces
{

    public enum ValidateErrors
    {
        UserIsNotActive,
        SecretNotValid,
        NoError
    }


    public enum DuplicateType
    {
        Username,
        Cnic,
        Pmdcno
    }
    public class ValidateResult
    {

        public int Id { get; set; }
        public string FirstName { get; set; } = "";
        public string Username { get; set; } = "";
        public Roles Role { get; set; } = Roles.Staff;
        public string Token { get; set; } = "";
        public string Created { get; set; } = "";
        public bool IsActive { get; set; }
        public string Picture { get; set; } = "";
        public bool Success { get; set; }
        public string Message { get; set; } = "";

        public bool HasMissingDetails { get; set; }


        public ValidateResult(UserViewModel? user = null, string jwtToken = "", bool success = false, bool hasMissingDetails = false, ValidateErrors error = ValidateErrors.NoError)
        {
            Success = success;
            if (success && user != null)
            {
                Id = user.Id;
                FirstName = user.Name is not null ? user.Name : "";
                Username = user.Username is not null ? user.Username : "";
                Token = jwtToken;
                Created = user.Created.ToShortDateString();
                IsActive = (bool)user.IsActive!;
                Role = user.Role;
                Picture = user.Picture ?? "";
                Message = "";
                HasMissingDetails = hasMissingDetails;
            }
            else
            {
                Message = error == ValidateErrors.UserIsNotActive ? "User is not active" : "Invalid Username/Password";
            }
        }
    }

    public interface IUserService
    {
        Task<UserViewModel?> GetUser(int id);
        Task<IEnumerable<NameIdPair>> GetDoctors();
        Task<PagedResults<UserViewModel>> GetUsers(DataFilter filter);

        Task<bool> CreateUser(CreateUserViewModel viewmodel);
        Task<bool> AddMissingDetails(UserMissingDetailsViewModel viewmodel);
        Task<bool> Update(int id, UpdateUserViewModel viewmodel);
        Task<bool> Delete(int id);
        Task<bool> AddToRole(int id, int role);
        Task<bool> ChangeUserStatus(int id);
        Task<bool> AddFees(int id, double fees);

        Task<bool> ResetSecret(int id);
        Task<bool> ChangeSecret(string identifier, string secret, string newsecret);
        Task<bool> ChangeSecret(int id, string secret, string newsecret);

        Task<ValidateResult> Validate(string identifier, string secret);
        Task<ValidateResult> GoogleValidate(string googleToken);
        bool SignOut();

        Task<bool> CheckDuplicate(DuplicateType type, string value, int id = -1);
    }
}
