using AutoMapper;
using Domain.Helpers;
using Domain.Models;
using Domain.Repositories;
using Domain.Viewmodels.Users;
using FMDC.BussinessLayer.Interfaces;
using FMDC.Security;
using Google.Apis.Auth;


namespace FMDC.BussinessLayer.Services
{
    public class UserService(IUnitOfWork unitOfWork, IJwtUtils jwtUtils, IMapper mapper, IEncryptionHandler encryptionHandler) : IUserService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly IMapper _mapper = mapper;
        private readonly IJwtUtils _jwtUtils = jwtUtils;
        private readonly IEncryptionHandler _encryptionHandler = encryptionHandler;

        public async Task<UserViewModel?> GetUser(int id)
        {

            if (id <= 0)
                throw new FmdcException("Id is not valid");
            var user = await _unitOfWork.Users.GetUserWithCityAndProvinceAsync(id) ?? throw new FmdcException("User does not exists");

            return _mapper.Map<UserViewModel>(user);


        }
        public async Task<IEnumerable<NameIdPair>> GetDoctors()
        {
            var doctors = await _unitOfWork.Users.GetDoctors();
            return doctors;
        }
        public async Task<PagedResults<UserViewModel>> GetUsers(DataFilter filter)
        {
            var records = await _unitOfWork.Users.GetUsersWithCityAndProvinceAsync(filter);
            var data = _mapper.Map<IEnumerable<UserViewModel>>(records.Data);

            return new PagedResults<UserViewModel>(data, records.CurrentPage, records.TotalRecords, records.PageSize);
        }

        public async Task<bool> CreateUser(CreateUserViewModel viewmodel)
        {
            var model = _mapper.Map<User>(viewmodel) ?? throw new FmdcException("Model is not valid");
            return await Create(model, viewmodel.Picture);
        }
        public async Task<bool> AddMissingDetails(UserMissingDetailsViewModel viewmodel)
        {

            await CheckPmdc(viewmodel.PMDCNo!, viewmodel.Id);
            await CheckCnic(viewmodel.CNIC!, viewmodel.Id);

            var user = await _unitOfWork.Users.GetByIdAsync(viewmodel.Id) ?? throw new FmdcException("User could not be found");

            user.PMDCNo = viewmodel.PMDCNo;
            user.CNIC = viewmodel.CNIC;
            user.Address = viewmodel.Address;
            user.DateofBirth = viewmodel.DateofBirth;
            user.Gender = viewmodel.Gender;
            user.CityId = viewmodel.CityId;
            user.Role = viewmodel.Role;
            user.PhoneNo = viewmodel.PhoneNo;
            user.PhoneType = viewmodel.PhoneType;
            user.Picture = FormatPicture(viewmodel.Picture);

            _unitOfWork.Users.Update(user);
            var rowsChanged = await _unitOfWork.SaveChangesAsync();
            return rowsChanged > 0;
        }
        public async Task<bool> Update(int id, UpdateUserViewModel viewmodel)
        {
            try
            {
                if (viewmodel.Role == Roles.Administrator)
                    throw new FmdcException("Change not allowed Please contact the Administrator");

                await CheckPmdc(viewmodel.PMDCNo!, viewmodel.Id);
                await CheckCnic(viewmodel.CNIC!, viewmodel.Id);

                var user = await _unitOfWork.Users.GetByIdAsync(viewmodel.Id) ?? throw new FmdcException("User could not be found");

                user.PMDCNo = ResolveNullinString(viewmodel.PMDCNo, user.PMDCNo!);
                user.Name = ResolveNullinString(viewmodel.Name, user.Name);
                user.CNIC = ResolveNullinString(viewmodel.CNIC, user.CNIC!);
                user.Address = ResolveNullinString(viewmodel.Address, user.Address!);
                user.DateofBirth = viewmodel.DateofBirth;
                user.Gender = viewmodel.Gender;
                user.CityId = viewmodel.CityId;
                user.Role = viewmodel.Role;
                user.PhoneNo = ResolveNullinString(viewmodel.PhoneNo, user.PhoneNo!);
                user.PhoneType = viewmodel.PhoneType;

                user.Picture = FormatPicture(viewmodel.Picture);

                _unitOfWork.Users.Update(user);
                var rowsChanged = await _unitOfWork.SaveChangesAsync();
                return rowsChanged > 0;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<bool> Delete(int id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id) ?? throw new FmdcException("User does not exists");
            if (user.Role == Roles.Administrator)
            {
                throw new FmdcException("Change not allowed Please contact the Administrator");
            }
            user.IsActive = false;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        public async Task<bool> AddToRole(int id, int role)
        {

            try
            {
                var user = await _unitOfWork.Users.GetByIdAsync(id) ?? throw new FmdcException("User does not exists");
                if (user.Role == Roles.Administrator)
                {
                    throw new FmdcException("Change not allowed Please contact the Administrator");
                }
                user.Role = (Roles)role;
                _unitOfWork.Users.Update(user);

                int rowsChanged = await _unitOfWork.SaveChangesAsync();
                return rowsChanged > 0;
            }
            catch (Exception)
            {

                return false;
            }
        }
        public async Task<bool> ChangeUserStatus(int id)
        {

            try
            {
                var user = await _unitOfWork.Users.GetByIdAsync(id) ?? throw new FmdcException("User does not exists");
                if (user.Role == Roles.Administrator)
                {
                    throw new FmdcException("Change not allowed Please contact the Administrator");
                }
                user.IsActive = !user.IsActive;
                _unitOfWork.Users.Update(user);

                int rowsChanged = await _unitOfWork.SaveChangesAsync();
                return rowsChanged > 0;
            }
            catch (Exception)
            {

                return false;
            }
        }


        public async Task<bool> AddFees(int id, double fees)
        {

            try
            {
                var user = await _unitOfWork.Users.GetByIdAsync(id) ?? throw new FmdcException("User does not exists");
                if (user.Role != Roles.Doctor)
                {
                    throw new FmdcException("User is not a doctor, fees cannot be added");
                }
                user.Fees = fees;
                _unitOfWork.Users.Update(user);

                int rowsChanged = await _unitOfWork.SaveChangesAsync();
                return rowsChanged > 0;
            }
            catch (Exception)
            {

                return false;
            }
        }


        public async Task<bool> ResetSecret(int id)
        {

            try
            {
                var user = await _unitOfWork.Users.GetByIdAsync(id) ?? throw new FmdcException("User does not exists");
                if (user.Role == Roles.Administrator)
                {
                    throw new FmdcException("Change not allowed Please contact the Administrator");
                }

                byte[] salt = HashHandler.GenerateRandomSalt();
                string hash = HashHandler.ComputeHash("123@abc", salt);

                user.Password = hash;
                user.PasswordSalt = Convert.ToBase64String(salt);

                _unitOfWork.Users.Update(user);
                int rowsChanged = await _unitOfWork.SaveChangesAsync();
                return rowsChanged > 0;
            }
            catch (Exception)
            {

                return false;
            }
        }

        public async Task<bool> ChangeSecret(string identifier, string secret, string newsecret)
        {

            return await ChangeSecret(secret, newsecret, identifier);

        }

        public async Task<bool> ChangeSecret(int id, string secret, string newsecret)
        {
            return await ChangeSecret(secret, newsecret, "", id);

        }


        private async Task<bool> ChangeSecret(string secret, string newsecret, string identifier = "", int id = -1)
        {
            try
            {

                if ((string.IsNullOrEmpty(identifier) && id <= 0) || string.IsNullOrEmpty(secret) || string.IsNullOrEmpty(newsecret))
                {
                    throw new FmdcException("Invalid Arguments");
                }

                if (identifier.Equals("admin", StringComparison.OrdinalIgnoreCase))
                    throw new FmdcException("Change not allowed Please contact the Administrator");

                var finalSecret = _encryptionHandler.DecryptRsa(secret);
                var finalNewSecret = _encryptionHandler.DecryptRsa(newsecret);

                var result = Validate(identifier, finalSecret).Result;

                if (result == null || result.Success)
                {
                    throw new FmdcException("Password is not correct");
                }

                var user = identifier != "" ? await _unitOfWork.Users.GetUserByUserName(identifier) ?? throw new FmdcException("User does not exists")
                    : id > 0 ? await _unitOfWork.Users.GetByIdAsync(id) ?? throw new FmdcException("User does not exists")
                    : throw new FmdcException("User does not exists");

                byte[] salt = HashHandler.GenerateRandomSalt();
                string hash = HashHandler.ComputeHash(finalNewSecret, salt);

                user.Password = hash;
                user.PasswordSalt = Convert.ToBase64String(salt);

                _unitOfWork.Users.Update(user);
                int rowsChanged = await _unitOfWork.SaveChangesAsync();
                return rowsChanged > 0;
            }
            catch (Exception)
            {

                return false;
            }


        }

        public async Task<ValidateResult> Validate(string identifier, string secret)
        {

            var user = await _unitOfWork.Users.GetUserByUserName(identifier) ?? throw new FmdcException("User not found");

            if (!user.IsActive)
            {
                throw new FmdcException("User is not active");
            }

            if (string.IsNullOrEmpty(secret))
            {
                throw new FmdcException("Password is not valid");
            }
            if (user.PasswordSalt is null) {
                throw new FmdcException("User not found");
            }
            byte[] salt = Convert.FromBase64String(user.PasswordSalt);
            string hash = HashHandler.ComputeHash(secret, salt);

            if (user.Password != hash)
            {
                return new ValidateResult(success: false, error: ValidateErrors.SecretNotValid);
            }
            else
            {
                var userVm = await GetUser(user.Id) ?? throw new FmdcException("User not found");
                var jwtToken = _jwtUtils.GenerateJwtToken(userVm);
                ValidateResult vr = new(userVm, jwtToken, success: true);
                return vr;

            }
        }
        public async Task<ValidateResult> GoogleValidate(string googleToken)
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(googleToken);

                if (payload == null || string.IsNullOrEmpty(payload.Email))
                {
                    return new ValidateResult(success: false, error: ValidateErrors.SecretNotValid);
                }

                var user = await _unitOfWork.Users.GetUserByUserName(payload.Email);

                if (user == null)
                {
                    user = new User
                    {
                        Name = payload.Name,
                        Username = payload.Email,
                        Created = DateTime.UtcNow,
                        Role = Roles.Staff,
                        IsActive = true,
                        Password = string.Empty,
                        PasswordSalt = string.Empty,
                        IsExternalAuth = true,
                        PMDCNo = "",
                        Address = "",
                        Picture = null,
                        Gender = Genders.Male,
                        PhoneNo = "",
                        PhoneType = -1,
                        DateofBirth = DateTime.UtcNow,
                        CNIC = "",
                        CityId = -1,
                    };
                    await _unitOfWork.Users.AddAsync(user);
                    await _unitOfWork.SaveChangesAsync();

                }
                else if (!user.IsActive)
                {
                    throw new FmdcException("User is not active");
                }
                var userVm = _mapper.Map<UserViewModel>(user);
                var jwtToken = _jwtUtils.GenerateJwtToken(userVm);
                ValidateResult vr = new(userVm, jwtToken, success: true, hasMissingDetails: userVm.IsExternalAuth && userVm.CNIC == "" && userVm.PMDCNo == "");
                return vr;
            }
            catch (Exception)
            {

                throw new FmdcException("Invalid Username/ Password");
            }
        }
        public bool SignOut()
        {

            return true;
        }

        public async Task<bool> CheckDuplicate(DuplicateType type, string value, int id = -1)
        {
            bool user = false;
            switch (type)
            {
                case DuplicateType.Username:
                    user = id == -1 ? await _unitOfWork.Users.AnyAsync(u => u.Username == value) : await _unitOfWork.Users.AnyAsync(u => u.Username == value && u.Id != id);
                    break;
                case DuplicateType.Cnic:
                    user = id == -1 ? await _unitOfWork.Users.AnyAsync(u => u.CNIC == value) : await _unitOfWork.Users.AnyAsync(u => u.CNIC == value && u.Id != id);
                    break;
                case DuplicateType.Pmdcno:
                    user = id == -1 ? await _unitOfWork.Users.AnyAsync(u => u.PMDCNo == value) : await _unitOfWork.Users.AnyAsync(u => u.PMDCNo == value && u.Id != id);
                    break;
            }
            return !user;
        }

        #region Private Methods
        private async Task<bool> Create(User model, string? picture = null)
        {
            try
            {
                if (model.Role == Roles.Administrator)
                    throw new FmdcException("Change not allowed Please contact the Administrator");
                if (model.PMDCNo is not null)
                {
                    await CheckPmdc(model.PMDCNo!);
                }

                await CheckUsername(model.Username);

                if (model.CNIC is not null)
                {
                    await CheckCnic(model.CNIC);
                }

                model.Password = string.IsNullOrEmpty(model.Password) ? "123@abc" : model.Password;

                if (!string.IsNullOrEmpty(model.Password))
                {
                    byte[] salt = HashHandler.GenerateRandomSalt();
                    string hash = HashHandler.ComputeHash(model.Password, salt);

                    model.Password = hash;
                    model.PasswordSalt = Convert.ToBase64String(salt);
                }
                model.Picture = FormatPicture(picture);

                await _unitOfWork.Users.AddAsync(model);

                var rowsChanged = await _unitOfWork.SaveChangesAsync();
                return rowsChanged > 0;
            }
            catch (Exception)
            {
                return false;
            }
        }
        private static string ResolveNullinString(string? value, string actualValue = "")
        {
            return string.IsNullOrEmpty(value) ? actualValue : value;
        }
        private static byte[]? FormatPicture(string? picture)
        {

            if (!string.IsNullOrEmpty(picture))
            {
                try
                {
                    // Remove data URI prefix if present
                    var base64Data = picture;
                    if (base64Data.Contains(','))
                    {
                        base64Data = base64Data[(base64Data.IndexOf(',', StringComparison.InvariantCulture) + 1)..];
                    }

                    return Convert.FromBase64String(base64Data);
                }
                catch (Exception ex)
                {
                    throw new FmdcException("Invalid image data: " + ex.Message);
                }
            }
            return null;

        }
        private async Task CheckPmdc(string value, int id = -1)
        {
            var exists = await _unitOfWork.Users.AnyAsync(u => u.PMDCNo == value && (id <= 0 || u.Id != id));
            if (exists)
                throw new FmdcException("Pmdc No already exists");

        }
        private async Task CheckCnic(string value, int id = -1)
        {
            var exists = await _unitOfWork.Users.AnyAsync(u => u.CNIC == value && (id <= 0 || u.Id != id));
            if (exists)
                throw new FmdcException("CNIC already exists");

        }
        private async Task CheckUsername(string value, int id = -1)
        {
            var exists = await _unitOfWork.Users.AnyAsync(u => u.Username == value && (id <= 0 || u.Id != id));
            if (exists)
                throw new FmdcException("Username already exists");

        }
        #endregion

    }
}
