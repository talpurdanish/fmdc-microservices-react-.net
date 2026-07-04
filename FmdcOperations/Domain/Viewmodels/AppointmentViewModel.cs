using Domain.Models;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Domain.Viewmodels
{
    public class AppointmentViewModel
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Appointment Date is Required")]
        [DisplayName("Start Date")]
        [DataType(DataType.Date), DisplayFormat(DataFormatString = "{0:dd/MM/yy}", ApplyFormatInEditMode = true)]
        public DateTime AppointmentDate { get; set; }

        [Required(ErrorMessage = "Appointment Start Time is Required")]
        [DisplayName("Start Time")]
        public string StartTime { get; set; } = "";

        [DisplayName("End Date")]
        [DataType(DataType.Date), DisplayFormat(DataFormatString = "{0:dd/MM/yy}", ApplyFormatInEditMode = true)]
        public DateTime? AppointmentEndDate { get; set; }

        [DisplayName("End Time")]
        public string EndTime { get; set; } = "";

        public int UserId { get; set; }
        public int PatientId { get; set; }

        public virtual UserViewModel User { get; set; } = new UserViewModel();
        public virtual PatientViewModel Patient { get; set; } = new PatientViewModel();

        public string PatientName { get; set; } = "";
        public string DoctorName { get; set; } = "";

    }
}
