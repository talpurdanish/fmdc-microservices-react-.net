using Domain.Models;
using Domain.Viewmodels;
using MediatR;

namespace FMDC.BussinessLayer.Features.Reports.Commands.UpdateValues
{
    public record UpdateValuesCommand(AddReportValues ReportValues) : IRequest<bool>;
}
