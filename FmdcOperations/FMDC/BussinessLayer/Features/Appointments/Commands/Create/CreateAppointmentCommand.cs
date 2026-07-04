using Domain.Viewmodels;
using MediatR;

namespace FMDC.BussinessLayer.Features.Appointments.Commands.Create
{
    public record CreateAppointmentCommand(AddAppointmentViewModel Model) : IRequest<bool>;
}
