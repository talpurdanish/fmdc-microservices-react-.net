using Domain.Models;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.TestParameters.Queries.GetOne
{
    public class GetTestParameterQueryHandler(FmdcOperationsContext context) : IRequestHandler<GetTestParameterQuery, TestParameter?>
    {
        public async Task<TestParameter?> Handle(GetTestParameterQuery request, CancellationToken cancellationToken)
        {
            return await context.TestParameters.Include(m => m.Test).FirstOrDefaultAsync(m => m.Id == request.Id,cancellationToken);
        }
    }
}
