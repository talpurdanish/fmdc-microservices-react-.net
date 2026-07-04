using Domain.Helpers;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.ProcedureTypes.Commands.Delete
{
    public class DeleteProcedureTypeCommandHandler(FmdcOperationsContext context) : IRequestHandler<DeleteProcedureTypeCommand, bool>
    {
        public async Task<bool> Handle(DeleteProcedureTypeCommand request, CancellationToken cancellationToken)
        {
            var ProcedureType = await context.ProcedureTypes.FirstOrDefaultAsync(m=>m.Id == request.Id,cancellationToken) ?? throw new FmdcException("ProcedureType could not be found");
            context.ProcedureTypes.Remove(ProcedureType);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
