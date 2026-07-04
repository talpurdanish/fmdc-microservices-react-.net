using Domain.Helpers;
using Domain.Models;
using FMDC.BussinessLayer.Features.Reports.Queries.Enums;
using MediatR;

namespace FMDC.BussinessLayer.Features.Reports.Queries.List
{
    public record ListReportsQuery(DataFilter Filter, ReportsListType Type = ReportsListType.All) : IRequest<PagedResults<LabReport>>;
}
