using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Reports.Commands.Update
{
    public record UpdateReportCommand(LabReport Model) : IRequest<bool>;
}
