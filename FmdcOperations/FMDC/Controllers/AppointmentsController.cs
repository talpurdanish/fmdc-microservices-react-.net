using Domain.Helpers;
using Domain.Models;
using Domain.Viewmodels;
using FMDC.Helpers;
using FMDC.BussinessLayer.Interfaces;
using FMDC.Security.Filters;
using Microsoft.AspNetCore.Mvc;

namespace FMDC.Controllers
{
    [Route("api/fmdc/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {

        private readonly IAppointmentService _service;
        private readonly INotificationService _notificationService;

        public AppointmentsController(IAppointmentService service, INotificationService notificationService)
        {
            _service = service;
            _notificationService = notificationService;

        }
        // GET: api/<AppointmentsController>
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet]
        public async Task<JsonResult> Get([FromQuery] DataFilter filter)
        {
            try
            {
                var appointments = await _service.GetAppointments(filter);

                return FmdcResult.Success(appointments, 200);
            }
            catch (Exception e)
            {
                return FmdcResult.Error("Appointments could not be fetched" + e.Message, 500);
            }
        }

        // GET api/<AppointmentsController>/5
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("{id}")]
        public async Task<JsonResult> Get(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("AppointmentId is not valid", 500);
                var appointment = await _service.GetAppointment(id);
                return FmdcResult.Success("", appointment, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("Appointment does not exists" + e.Message, 500);
            }
        }
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("[action]/{id}")]
        public async Task<JsonResult> GetPatientAppointments([FromQuery ]DataFilter filter)
        {
            try
            {
                if (filter.Id <= 0)
                    return FmdcResult.Error("Patient Id is not valid", 500);
                var appointment = await _service.GetPatientAppointments(filter);
                return FmdcResult.Success("", appointment, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("Appointment does not exists" + e.Message, 500);
            }
        }
        [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
        [HttpGet("[action]")]
        public async Task<JsonResult> GetPending()
        {
            try
            {
                var user = GetCurrentUser();
                var id = user is not null && user.Role != "1" ? user.Id : -1;

                var appointment = await _service.GetPending(id);
                return FmdcResult.Success("", appointment, 200);
            }
            catch (Exception e)
            {

                return FmdcResult.Error("Appointment does not exists" + e.Message, 500);
            }
        }
        [Authorize(Roles.Administrator, Roles.Staff)]
        // POST api/<AppointmentsController>
        [HttpPost]
        public async Task<JsonResult> Post([FromBody] AddAppointmentViewModel viewModel)
        {
            try
            {
                var result = await _service.Create(viewModel);
                var user = GetCurrentUser();
                if (result)
                {
                    await _notificationService.SendNotificationAsync(user?.Id, new NotificationMessage
                    {
                        Type = NotificationType.AppointmentCreated,
                        Message = "",
                        Data = { },
                        ShowMessage = false,
                    });
                    return FmdcResult.Success("Appointment has been created", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Appointment could not be created", 400);
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


        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpPut("[action]")]
        public async Task<JsonResult> AddEndDate([FromBody] UserValue input)
        {
            try
            {
                var id = input.id;
                var result = await _service.AddEndDate(id, input.value);
                var user = GetCurrentUser();
                if (result)
                {
                    await _notificationService.SendNotificationAsync(user?.Id, new NotificationMessage
                    {
                        Type = NotificationType.AppointmentEnded,
                        Message = "",
                        Data = { },
                        ShowMessage = false,
                    });
                    return FmdcResult.Success("Appointment has been updated", null, 200);
                }
                else
                {
                    return FmdcResult.Error("Appointment could not be updated", 400);
                }
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }

        // DELETE api/<AppointmentsController>/5
        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpDelete("{id}")]
        public async Task<JsonResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("AppointmentId is not valid", 500);
                var result = await _service.Delete(id);
                if (result)
                    return FmdcResult.Success("Appointment has been deleted", null, 200);
                else
                    return FmdcResult.Error("Appointment has not been deleted", 500);
            }
            catch (Exception e)
            {

                return FmdcResult.Error(e.Message, 500);
            }
        }

        [HttpGet("[action]")]
        public async Task<JsonResult> GetStats()
        {
            try
            {
                var id = -1;
                var doctor = GetCurrentUser();
                if (doctor is not null && doctor.Role == Roles.Doctor)
                    id = doctor.Id;
                var stats = await _service.GetStat(id);
                return FmdcResult.Success("", stats, 200);
            }
            catch (Exception e)
            {
                return FmdcResult.Error("No Stats Available" + e.Message, 500);
            }
        }
        private UserViewModel? GetCurrentUser()
        {
            return HttpContext.Items["User"] as UserViewModel;

        }

        [Authorize(Roles.Administrator, Roles.Staff)]
        [HttpGet("[action]/{id}")]
        public async Task<JsonResult> GetButtons(int id)
        {
            try
            {
                if (id <= 0)
                    return FmdcResult.Error("PatientId is not valid", 500);
                var stats = await _service.GetButtons(id);
                return FmdcResult.Success("", stats, 200);
            }
            catch (Exception)
            {
                return FmdcResult.Error("No Buttons Available", 500);
            }
        }
    }
}
