using Domain.Models;
using Domain.Repositories;
using FMDC.Context;
using Microsoft.EntityFrameworkCore;

namespace FMDC.Repositories
{
    public class NotificationRepository(FmdcUsersContext context) : Repository<Notification>(context), INotificationRepository
    {
        private readonly FmdcUsersContext _context = context;

        public async Task<bool> CreateNotification(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
            var rowsChanged = await _context.SaveChangesAsync();
            return rowsChanged > 0;
        }

        public async Task<IEnumerable<Notification>> GetNotificationsAsync(int id)
        {
            var notifications = await _context.Notifications
                   .Where(n => n.UserId == id)
                   .OrderByDescending(n => n.CreatedAt)
                   .Select(n => new Notification
                   {
                       Id = n.Id,
                       Message = n.Message,
                       IsRead = n.IsRead,
                       Type = n.Type,
                       CreatedAt = n.CreatedAt
                   }).Take(20)
                   .ToListAsync();
            return notifications;
        }

        public async Task<bool> MarkAllAsRead(int id)
        {
            var unreadNotifications = await _context.Notifications
                             .Where(n => !n.IsRead && n.UserId == id)
                             .ToListAsync();

            foreach (var notification in unreadNotifications)
            {
                notification.IsRead = true;
            }

            var rowsChanged = await _context.SaveChangesAsync();

            return rowsChanged > 0;
        }
    }
}
