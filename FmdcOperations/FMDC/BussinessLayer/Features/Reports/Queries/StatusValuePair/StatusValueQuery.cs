using FMDC.BussinessLayer.Features.Reports.Queries.DTOs;
using FMDC.BussinessLayer.Features.Reports.Queries.Enums;
using MediatR;

namespace FMDC.BussinessLayer.Features.Reports.Queries.StatusValuePair

{
    public record StatusValueQuery(int ReportId, int Id, StatusValuePairType Type = StatusValuePairType.ByParameterId) : IRequest<List<StatusValuePairModel>>;
}
