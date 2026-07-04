namespace Domain.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public NotificationType Type { get; set; }       // e.g. "PaymentSucceeded"
        public string? Message { get; set; }    // human-readable text
        public int UserId { get; set; }     // optional: scope to a user
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? DataJson { get; set; } = string.Empty;   // store payload as JSON if needed
        public Boolean IsRead { get; set; }

    }

    public enum NotificationType
    {
        PaymentSucceeded,
        PaymentFailed,
        AppointmentCreated,
        AppointmentEnded,
        GeneralAlert
    }

    public enum NotificationSeverity
    {
        Success,
        Info,
        Warning,
        Error
    }
}