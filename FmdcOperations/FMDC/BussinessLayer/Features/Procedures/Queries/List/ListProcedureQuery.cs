using Domain.Helpers;
using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Procedures.Queries.List
{
    public record ListProcedureQuery(DataFilter Filter) : IRequest<PagedResults<Procedure>>;
}
