using Domain.Helpers;
using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.ProcedureTypes.Queries.List
{
    public record ListProcedureTypeQuery(DataFilter Filter) : IRequest<PagedResults<ProcedureType>>;
}
