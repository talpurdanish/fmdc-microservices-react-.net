using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.TestParameters.Commands.Update
{
    public class UpdateTestParameterCommandHandler(FmdcOperationsContext context) : IRequestHandler<UpdateTestParameterCommand, bool>
    {
        public async Task<bool> Handle(UpdateTestParameterCommand request, CancellationToken cancellationToken)
        {
            context.TestParameters.Update(request.Model);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
