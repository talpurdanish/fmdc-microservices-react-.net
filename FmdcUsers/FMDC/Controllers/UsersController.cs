using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels.Users;
using FMDC.BussinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AuthorizeAttribute = FMDC.Security.Filters.AuthorizeAttribute;

namespace FMDC.Controllers
{
    [Route("api/fmdc/[controller]")]
    [ApiController]
    public class UsersController(IUserService userService) : ControllerBase
    {

        private readonly IUserService _service = userService;

        // GET: api/<UsersController>
        [Authorize(Roles.Administrator, Roles.Doctor, Roles.Staff)]
        [HttpGet]
        public async Task<JsonResult> Get([FromQuery] DataFilter filter)
        {

            try
            {
                var users = await _service.GetUsers(filter);

                return FmdcResult.Success(users, 200);
            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception)
            {

                return FmdcResult.Error("Users could not be fetched", 500);
            }
        }
        
        [Authorize(Roles.Administrator, Roles.Doctor, Roles.Staff)]
        [HttpGet("[action]")]
        public async Task<JsonResult> GetDoctors()
        {
            try
            {
                var doctors = await _service.GetDoctors();
                return FmdcResult.Success(doctors, 200);
            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception)
            {

                return FmdcResult.Error("Users could not be fetched", 500);
            }
        }
        
        // GET api/<UsersController>/5
        [Authorize(Roles.Administrator, Roles.Doctor, Roles.Staff)]
        [HttpGet("{id}")]
        public async Task<JsonResult> Get(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("UserId is not valid", 500);
                var user = await _service.GetUser(id);
                if (user == null || user!.Role == Roles.Administrator)
                {
                    return FmdcResult.Error("User does not exists", 500);
                }
                return FmdcResult.Success(user, 200);
            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception)
            {

                return FmdcResult.Error("User does not exists", 500);
            }
        }

        //POST api/<UsersController>
        [Authorize(Roles.Administrator)]
        [HttpPost("[action]")]
        public async Task<JsonResult> CreateUser([FromBody] CreateUserViewModel viewModel)
        {
            try
            {
                var result = await _service.CreateUser(viewModel);
                
                if (result)
                {
                    return FmdcResult.Success("User has been created", null, 200);
                }
                else {
                    return FmdcResult.Error("User could not be created", 400);
                }
            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }
        
        [Authorize(Roles.Administrator)]
        [HttpPost("[action]")]
        public async Task<JsonResult> AddMissingDetails([FromBody] UserMissingDetailsViewModel viewModel)
        {
            try
            {
                var result = await _service.AddMissingDetails(viewModel);

                if (result)
                {
                    return FmdcResult.Success("User has been created", null, 200);
                }
                else
                {
                    return FmdcResult.Error("User could not be created", 400);
                }
            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }
        
        // PUT api/<UsersController>
        [Authorize(Roles.Administrator, Roles.Doctor, Roles.Staff)]
        [HttpPut("{id}")]
        public async Task<JsonResult> Put([FromBody] UpdateUserViewModel viewModel, int id)
        {
            try
            {
                var result = await _service.Update(id, viewModel);
                if (result)
                {
                    return FmdcResult.Success("User has been updated", null, 200);
                }
                else
                {
                    return FmdcResult.Error("User could not be updated", 400);
                }
            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }

        // DELETE api/<UsersController>/5
        [Authorize(Roles.Administrator)]
        [HttpDelete("{id}")]
        public async Task<JsonResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("UserId is not valid", 500);
                var result = await _service.Delete(id);
                if (result)
                    return FmdcResult.Success("User has been deleted", null, 200);
                else
                    return FmdcResult.Error("User could not be deleted", 400);
            }
            catch (FmdcException ae)
            {

                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }
        
        [Authorize(Roles.Administrator)]
        [HttpGet("[action]")]
        public async Task<bool> CheckUsername([FromQuery] string value = "", int id = -1)
        {
            try
            {
                if (string.IsNullOrEmpty(value))
                    return false;
                var signUpResult = await _service.CheckDuplicate(DuplicateType.Username, value, id);

                return signUpResult;
            }
            catch (FmdcException)
            {

                return true;
            }
            catch (Exception)
            {

                return true;
            }
        }

        [Authorize(Roles.Administrator)]
        [HttpGet("[action]")]
        public async Task<bool> CheckCNIC([FromQuery] string value, int id = -1)
        {
            try
            {
                if (string.IsNullOrEmpty(value))
                    return false;
                var signUpResult = await _service.CheckDuplicate(DuplicateType.Cnic, value, id);

                return signUpResult;
            }
            catch (FmdcException)
            {

                return true;
            }
            catch (Exception)
            {

                return true;
            }
        }

        [Authorize(Roles.Administrator)]
        [HttpGet("[action]")]
        public async Task<bool> CheckPMDCNo([FromQuery] string value, int id = -1)
        {
            try
            {
                if (string.IsNullOrEmpty(value))
                    return false;
                var signUpResult = await _service.CheckDuplicate(DuplicateType.Pmdcno, value, id);

                return signUpResult;
            }
            catch (FmdcException)
            {

                return true;
            }
            catch (Exception)
            {

                return true;
            }
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<JsonResult> GoogleLogin(GoogleTokenModel tokenModel)
        {
            try
            {
                var response = await _service.GoogleValidate(tokenModel.GoogleToken);
                if (response != null && response.Success)
                {
                    Thread.Sleep(500);
                    return
                        FmdcResult.Success("", response, 200);
                }
                else
                {

                    return FmdcResult.Error(response != null && response.Message != null ? response.Message : "Invalid Username/Password", 500);
                }

            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }
        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<JsonResult> Login(LoginViewModel login)
        {
            try
            {
                var response = await _service.Validate(login.Username, login.Password);
                if (response != null && response.Success)
                {
                    Thread.Sleep(500);
                    return
                        FmdcResult.Success("", response, 200);
                }
                else
                {

                    return FmdcResult.Error(response != null && response.Message != null ? response.Message : "Invalid Username/Password", 500);
                }

            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }
        [Authorize(Roles.Administrator, Roles.Doctor, Roles.Staff)]
        [HttpGet("[action]")]
        public JsonResult Logout()
        {
            try
            {

                HttpContext.Items["User"] = null;
                return FmdcResult.Success("User has been Logged Out", 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }
        [Authorize(Roles.Administrator)]
        [HttpPost("[action]/{id}")]
        public async Task<JsonResult> ChangeRole(int id, [FromQuery] int value)
        {

            try
            {
                if (id <= 0)
                    return FmdcResult.Error("UserId is not valid", 500);

                if (value < 2 || value > 3)
                    return FmdcResult.Error("Role is not valid", 500);

                var result = await _service.AddToRole(id, value);
                if (result)
                {
                    return FmdcResult.Success("Role has been changed", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Role could not be changed", 400);
                }

            }
            catch (FmdcException ae)
            {

                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }
        [Authorize(Roles.Administrator)]
        [HttpPost("[action]/{id}")]
        public async Task<JsonResult> ChangeStatus(int id)
        {

            try
            {
                var result = await _service.ChangeUserStatus(id);

                if (result)
                {
                    return FmdcResult.Success("User Status has been changed", null, 200);
                }
                else
                {
                    return FmdcResult.Error("User Status could not be changed", 400);
                }
            }
            catch (FmdcException ae)
            {

                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }


        [Authorize(Roles.Administrator)]
        [HttpPost("[action]/{id}")]
        public async Task<JsonResult> AddFees(int id, [FromQuery] double fees)
        {
            try
            {
                var result = await _service.AddFees(id, fees);
                if (result)
                {
                    return FmdcResult.Success("Doctor's Fees has been changed", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Doctor's Fees could not be changed", 400);
                }
            }
            catch (FmdcException ae)
            {

                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }

        [Authorize(Roles.Administrator)]
        [HttpPost("[action]/{id}")]
        public async Task<JsonResult> ResetPassword(int id)
        {

            try
            {
                if (id <= 0)
                    return FmdcResult.Error("UserId is not valid", 500);

                var result = await _service.ResetSecret(id);
                if (result)
                {
                    return FmdcResult.Success("Password has been reset", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Password could not be reset", 400);
                }
            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {
                return FmdcResult.Error(e.Message, 500);
            }
        }

        [Authorize(Roles.Administrator)]
        [HttpPost("[action]/{id}")]
        public async Task<JsonResult> ChangePassword(int id, [FromBody] ChangePasswordViewModel viewModel)
        {

            try
            {
                if (id <= 0)
                    return FmdcResult.Error("UserId is not valid", 500);

                if(!ModelState.IsValid)
                    return FmdcResult.Error("UserId is not valid", 500);

                var result = await _service.ChangeSecret(id, viewModel.Oldpassword, viewModel.Newpassword);
                if (result)
                {
                    return FmdcResult.Success("Password has been reset", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Password could not be reset", 400);
                }
            }
            catch (FmdcException ae)
            {
                return FmdcResult.Error(ae.Message, 500);
            }
            catch (Exception e)
            {
                return FmdcResult.Error(e.Message, 500);
            }
        }

        [HttpGet("[action]")]
        public JsonResult GetCurrentUser()
        {
           var user = HttpContext.Items["User"] as UserViewModel;
            string? authHeader = HttpContext.Request.Headers.Authorization;
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ",StringComparison.InvariantCultureIgnoreCase))
            {
                string token = authHeader["Bearer ".Length..];
                ValidateResult vr = new(user, token, success: true);
                return FmdcResult.Success("", vr, 200);
            }
            return FmdcResult.Error("You are not authorized", 400);

        }

    }
}
