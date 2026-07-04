using Domain.Helpers;
using FMDC.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FMDC.BussinessLayer.Features.Procedures.Commands.Delete
{
    public class DeleteProcedureCommandHandler(FmdcOperationsContext context) : IRequestHandler<DeleteProcedureCommand, bool>
    {
        public async Task<bool> Handle(DeleteProcedureCommand request, CancellationToken cancellationToken)
        {
            var Procedure = await context.Procedures.FirstOrDefaultAsync(m=>m.Id == request.Id,cancellationToken) ?? throw new FmdcException("Procedure could not be found");
            context.Procedures.Remove(Procedure);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
