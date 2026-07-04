using Domain.Helpers;
using Domain.Models;
using Domain.Repositories;
using Domain.Viewmodels;
using Domain.Viewmodels.Users;
using FMDC.Context;
using FMDC.Helpers;
using FMDC.Security.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FMDC.Controllers
{
    [Route("api/fmdc/[controller]")]
    [ApiController]
    [Authorize(Roles.Administrator, Roles.Staff, Roles.Doctor)]
    public class NotificationsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly INotificationService _notificationService;
        public NotificationsController(IUnitOfWork unitOfWork, INotificationService notificationService)
        {
            _notificationService = notificationService;
            _unitOfWork = unitOfWork;
        }
        // GET: api/<NotifcationsController>
        [HttpGet]
        public async Task<JsonResult> Get()
        {
            var currentUser = GetCurrentUser();
            if (currentUser is not null)
            {
                var notifications = await _unitOfWork.Notifications.GetNotificationsAsync(currentUser.Id);

                return FmdcResult.Success("", notifications, 200);
            }
            else
            {
                return FmdcResult.Error("User Not Found", 500);
            }
        }


        [HttpPost]
        public async Task<JsonResult> MarkAllRead()
        {

            var currentUser = GetCurrentUser();
            if (currentUser is not null)
            {
                await _unitOfWork.Notifications.MarkAllAsRead(currentUser.Id);
                return FmdcResult.Success("All Notifications have been marked read", 200);
            }
            else
            {
                return FmdcResult.Error("User Not Found", 500);
            }
        }



        [HttpGet("[action]")]
        public async Task<JsonResult> TestNotification()
        {

            var currentUser = GetCurrentUser();
            if (currentUser is not null)
            {
                await _notificationService.SendNotificationAsync(currentUser?.Id, new NotificationMessage
                {
                    Type = NotificationType.PaymentFailed,
                    Message = $"Payment Failed {DateTime.Now.ToString("dd-MMM-yyyy HH:mm:ss", CultureInfo.InvariantCulture)}",
                    Data = new { PaymentIntentId = "", Amount = 0 }
                });

                return FmdcResult.Success("Notification sent", 200);
            }
            else
            {
                return FmdcResult.Error("User Not Found", 500);
            }

        }


        private UserViewModel? GetCurrentUser()
        {
            return HttpContext.Items["User"] as UserViewModel;

        }
    }
}
