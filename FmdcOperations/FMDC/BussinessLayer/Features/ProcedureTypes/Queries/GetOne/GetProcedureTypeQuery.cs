using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.ProcedureTypes.Queries.GetOne
{
    public record GetProcedureTypeQuery(int Id) : IRequest<ProcedureType?>;
}
