using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.Tests.Commands.Create
{
    public class CreateTestCommandHandler(FmdcOperationsContext context) : IRequestHandler<CreateTestCommand, bool>
    {
        public async Task<bool> Handle(CreateTestCommand request, CancellationToken cancellationToken)
        {

            await context.Tests.AddAsync(request.Model,cancellationToken);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
