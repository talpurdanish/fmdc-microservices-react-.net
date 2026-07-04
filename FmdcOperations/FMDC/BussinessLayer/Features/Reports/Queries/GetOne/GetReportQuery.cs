using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Reports.Queries.GetOne
{
    public record GetReportQuery(int Id) : IRequest<LabReport?>;
}
