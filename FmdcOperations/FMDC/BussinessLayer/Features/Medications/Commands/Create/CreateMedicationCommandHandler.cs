using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.Medications.Commands.Create
{
    public class CreateMedicationCommandHandler(FmdcOperationsContext context) : IRequestHandler<CreateMedicationCommand, bool>
    {
        public async Task<bool> Handle(CreateMedicationCommand request, CancellationToken cancellationToken)
        {

            await context.Medications.AddAsync(request.Model,cancellationToken);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
