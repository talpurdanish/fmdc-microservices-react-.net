using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.Procedures.Commands.Create
{
    public class CreateProcedureCommandHandler(FmdcOperationsContext context) : IRequestHandler<CreateProcedureCommand, bool>
    {
        public async Task<bool> Handle(CreateProcedureCommand request, CancellationToken cancellationToken)
        {

            await context.Procedures.AddAsync(request.Model,cancellationToken);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
