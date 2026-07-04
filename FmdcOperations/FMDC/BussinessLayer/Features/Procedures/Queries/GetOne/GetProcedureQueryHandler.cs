using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Procedures.Queries.GetOne
{
    public class GetProcedureQueryHandler(FmdcOperationsContext context) : IRequestHandler<GetProcedureQuery, Procedure?>
    {
        public async Task<Procedure?> Handle(GetProcedureQuery request, CancellationToken cancellationToken)
        {
            return await context.Procedures.Include(m => m.ProcedureType).FirstOrDefaultAsync(m => m.Id == request.Id,cancellationToken);
        }
    }
}
