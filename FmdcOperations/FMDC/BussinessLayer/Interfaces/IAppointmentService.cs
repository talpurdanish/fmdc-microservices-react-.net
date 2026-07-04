using Domain.Helpers;

using Domain.Viewmodels;

namespace FMDC.BussinessLayer.Interfaces
{
    public interface IAppointmentService
    {
        Task<AppointmentViewModel?> GetAppointment(int id);
        Task<PagedResults<AppointmentViewModel>> GetAppointments(DataFilter filter, int id = -1);
        Task<PagedResults<AppointmentViewModel>> GetPatientAppointments(DataFilter filter);
        Task<PagedResults<AppointmentViewModel>> GetPending(int id = -1);

        Task<bool> Create(AddAppointmentViewModel viewModel);
        Task<bool> Delete(int id);
        Task<bool> AddEndDate(int id, string? type = "p");

        Task<AppointmentStatViewModel?> GetStat(int id = -1);

        Task<PatientButtons> GetButtons(int id);

    }
}
