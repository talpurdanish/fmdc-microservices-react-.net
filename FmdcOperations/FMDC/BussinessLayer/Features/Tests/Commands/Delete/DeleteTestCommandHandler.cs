using Domain.Helpers;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Tests.Commands.Delete
{
    public class DeleteTestCommandHandler(FmdcOperationsContext context) : IRequestHandler<DeleteTestCommand, bool>
    {
        public async Task<bool> Handle(DeleteTestCommand request, CancellationToken cancellationToken)
        {
            var Test = await context.Tests.FirstOrDefaultAsync(m=>m.Id == request.Id,cancellationToken) ?? throw new FmdcException("Test could not be found");
            if (Test.TestParameters.Count > 0)
                throw new FmdcException("Delete Test Parameters before deleting the test");

            context.Tests.Remove(Test);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
