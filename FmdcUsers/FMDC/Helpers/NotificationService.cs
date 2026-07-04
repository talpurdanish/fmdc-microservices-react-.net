using Domain.Models;
using Domain.Repositories;
using Domain.Viewmodels;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;


namespace FMDC.Helpers
{
    public interface INotificationService
    {
        Task SendNotificationAsync(int? UserId, NotificationMessage notification);
    }

    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IUnitOfWork _unitOfWork;
    
        public NotificationService(
            IHubContext<NotificationHub> hubContext,
            IUnitOfWork unitOfWork)
        {
            _hubContext = hubContext;
            _unitOfWork = unitOfWork;
            
        }


        public async Task SendNotificationAsync(int? UserId, NotificationMessage notification)
        {
            
            if (UserId is not null && UserId > 0)
            {
                var entity = new Notification
                {
                    Type = notification.Type,
                    Message = notification.Message,
                    UserId = (int)UserId, // store user ID if available
                    DataJson = notification.Data != null ? JsonSerializer.Serialize(notification.Data) : null,
                    CreatedAt = DateTime.UtcNow,
                    IsRead= false
                };

                await _unitOfWork.Notifications.CreateNotification(entity);

                await _hubContext.Clients.All
                    .SendAsync("ReceiveNotification", notification);
            }
            else
            {
                // fallback: broadcast if no user context
                await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification);
            }

        }
    }

}
