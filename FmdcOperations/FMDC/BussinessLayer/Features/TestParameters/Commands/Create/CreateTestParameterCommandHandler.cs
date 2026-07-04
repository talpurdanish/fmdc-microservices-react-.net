using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.TestParameters.Commands.Create
{
    public class CreateTestParameterCommandHandler(FmdcOperationsContext context) : IRequestHandler<CreateTestParameterCommand, bool>
    {
        public async Task<bool> Handle(CreateTestParameterCommand request, CancellationToken cancellationToken)
        {

            await context.TestParameters.AddAsync(request.Model,cancellationToken);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
