using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.ProcedureTypes.Commands.Create
{
    public class CreateProcedureTypeCommandHandler(FmdcOperationsContext context) : IRequestHandler<CreateProcedureTypeCommand, bool>
    {
        public async Task<bool> Handle(CreateProcedureTypeCommand request, CancellationToken cancellationToken)
        {

            await context.ProcedureTypes.AddAsync(request.Model,cancellationToken);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
