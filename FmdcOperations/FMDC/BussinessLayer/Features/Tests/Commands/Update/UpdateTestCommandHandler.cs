using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.Tests.Commands.Update
{
    public class UpdateTestCommandHandler(FmdcOperationsContext context) : IRequestHandler<UpdateTestCommand, bool>
    {
        public async Task<bool> Handle(UpdateTestCommand request, CancellationToken cancellationToken)
        {
            context.Tests.Update(request.Model);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
