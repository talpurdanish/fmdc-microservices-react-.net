using Domain.Models;

namespace Domain.Viewmodels
{
    public class NotificationMessage
    {
        public NotificationType Type { get; set; }

        public NotificationSeverity Severity { get; set; } = NotificationSeverity.Info;
        public string Message { get; set; } = string.Empty;
        public object? Data { get; set; } 

        public bool ShowMessage { get; set; }
    }
}
