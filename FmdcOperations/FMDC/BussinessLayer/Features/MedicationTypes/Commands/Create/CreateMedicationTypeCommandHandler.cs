using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.MedicationTypes.Commands.Create
{
    public class CreateMedicationTypeCommandHandler(FmdcOperationsContext context) : IRequestHandler<CreateMedicationTypeCommand, bool>
    {
        public async Task<bool> Handle(CreateMedicationTypeCommand request, CancellationToken cancellationToken)
        {

            await context.MedicationTypes.AddAsync(request.Model,cancellationToken);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
