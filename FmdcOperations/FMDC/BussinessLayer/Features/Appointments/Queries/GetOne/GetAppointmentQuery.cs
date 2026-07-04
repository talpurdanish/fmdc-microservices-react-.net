using Domain.Viewmodels;
using MediatR;

namespace FMDC.BussinessLayer.Features.Appointments.Queries.GetOne
{
    public record GetAppointmentQuery(int Id) : IRequest<AppointmentViewModel?>;
}
