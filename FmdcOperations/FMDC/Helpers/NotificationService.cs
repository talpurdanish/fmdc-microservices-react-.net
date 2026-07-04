using Domain.Models;
using Domain.Viewmodels;
using FMDC.BussinessLayer.Clients;
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
        
        private readonly IClientService _clientService;

        public NotificationService(
            IHubContext<NotificationHub> hubContext,
             IClientService clientService)
        {
            _hubContext = hubContext;
            _clientService = clientService;


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

               await _clientService.SaveNotificationAsync(entity); // save to database

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
