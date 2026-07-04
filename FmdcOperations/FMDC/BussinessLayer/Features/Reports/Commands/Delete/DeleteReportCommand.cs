using Domain.Viewmodels;
using MediatR;

namespace FMDC.BussinessLayer.Features.Reports.Commands.Delete
{
    public record DeleteReportCommand(int Id) : IRequest<bool>;
}
