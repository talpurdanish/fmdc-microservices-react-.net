using Domain.Helpers;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.TestParameters.Commands.Delete
{
    public class DeleteTestParameterCommandHandler(FmdcOperationsContext context) : IRequestHandler<DeleteTestParameterCommand, bool>
    {
        public async Task<bool> Handle(DeleteTestParameterCommand request, CancellationToken cancellationToken)
        {
            var TestParameter = await context.TestParameters.FirstOrDefaultAsync(m=>m.Id == request.Id,cancellationToken) ?? throw new FmdcException("TestParameter could not be found");
            context.TestParameters.Remove(TestParameter);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
