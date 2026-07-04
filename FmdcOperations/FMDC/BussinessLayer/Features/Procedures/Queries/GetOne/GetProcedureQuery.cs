using Domain.Models;
using MediatR;

namespace FMDC.BussinessLayer.Features.Procedures.Queries.GetOne
{
    public record GetProcedureQuery(int Id) : IRequest<Procedure?>;
}
