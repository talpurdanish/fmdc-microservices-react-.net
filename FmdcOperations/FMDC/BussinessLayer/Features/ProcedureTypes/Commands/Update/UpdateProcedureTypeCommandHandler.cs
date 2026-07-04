using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.ProcedureTypes.Commands.Update
{
    public class UpdateProcedureTypeCommandHandler(FmdcOperationsContext context) : IRequestHandler<UpdateProcedureTypeCommand, bool>
    {
        public async Task<bool> Handle(UpdateProcedureTypeCommand request, CancellationToken cancellationToken)
        {
            context.ProcedureTypes.Update(request.Model);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
