using MediatR;

namespace FMDC.BussinessLayer.Features.Appointments.Commands.Delete
{
    public record DeleteAppointmentCommand(int Id) : IRequest<bool>;
}
