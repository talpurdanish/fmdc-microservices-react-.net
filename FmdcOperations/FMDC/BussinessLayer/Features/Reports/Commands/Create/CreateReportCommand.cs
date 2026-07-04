using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Reports.Commands.Create
{
    public record CreateReportCommand(LabReport Model) : IRequest<bool>;
}
