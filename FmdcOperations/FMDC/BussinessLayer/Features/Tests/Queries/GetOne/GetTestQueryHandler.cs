using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Tests.Queries.GetOne
{
    public class GetTestQueryHandler(FmdcOperationsContext context) : IRequestHandler<GetTestQuery, Test?>
    {
        public async Task<Test?> Handle(GetTestQuery request, CancellationToken cancellationToken)
        {
            return await context.Tests.FirstOrDefaultAsync(m => m.Id == request.Id,cancellationToken);
        }
    }
}
