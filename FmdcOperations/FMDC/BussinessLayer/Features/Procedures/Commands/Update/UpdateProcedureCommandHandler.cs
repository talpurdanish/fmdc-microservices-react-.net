using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.Procedures.Commands.Update
{
    public class UpdateProcedureCommandHandler(FmdcOperationsContext context) : IRequestHandler<UpdateProcedureCommand, bool>
    {
        public async Task<bool> Handle(UpdateProcedureCommand request, CancellationToken cancellationToken)
        {
            context.Procedures.Update(request.Model);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
