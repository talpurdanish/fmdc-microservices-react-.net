using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.ProcedureTypes.Queries.GetOne
{
    public class GetProcedureTypeQueryHandler(FmdcOperationsContext context) : IRequestHandler<GetProcedureTypeQuery, ProcedureType?>
    {
        public async Task<ProcedureType?> Handle(GetProcedureTypeQuery request, CancellationToken cancellationToken)
        {
            return await context.ProcedureTypes.FirstOrDefaultAsync(m => m.Id == request.Id,cancellationToken);
        }
    }
}
