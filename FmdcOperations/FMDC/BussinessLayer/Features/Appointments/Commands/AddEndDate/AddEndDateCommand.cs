using MediatR;

namespace FMDC.BussinessLayer.Features.Appointments.Commands.AddEndDate
{
    public record AddEndDateCommand(int Id, string? Type = "p") : IRequest<bool>;
}
