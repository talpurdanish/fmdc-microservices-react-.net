using Domain.Helpers;
using Domain.Models;

namespace Domain.Repositories
{
    public interface INotificationRepository : IRepository<Notification>
    {
        Task<IEnumerable<Notification>> GetNotificationsAsync(int id);
        Task<bool> MarkAllAsRead(int id);

        Task<bool> CreateNotification(Notification notification);
    }
}
