using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Receipts.Commands.UpdateAppointment
{
    public record UpdateAppointmentCommand(Appointment Model) : IRequest<bool>;
}
