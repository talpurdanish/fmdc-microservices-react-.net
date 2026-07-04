using MediatR;

namespace FMDC.BussinessLayer.Features.Reports.Queries.MaxReportNumber
{
    public record GetMaxQuery() : IRequest<int>;
}
