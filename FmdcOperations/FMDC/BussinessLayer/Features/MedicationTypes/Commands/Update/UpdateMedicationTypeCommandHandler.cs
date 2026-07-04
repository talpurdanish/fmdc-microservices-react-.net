using FMDC.Context;
using MediatR;

namespace FMDC.BussinessLayer.Features.MedicationTypes.Commands.Update
{
    public class UpdateMedicationTypeCommandHandler(FmdcOperationsContext context) : IRequestHandler<UpdateMedicationTypeCommand, bool>
    {
        public async Task<bool> Handle(UpdateMedicationTypeCommand request, CancellationToken cancellationToken)
        {
            context.MedicationTypes.Update(request.Model);
            var rowsChanged = await context.SaveChangesAsync(cancellationToken);
            return rowsChanged > 0;
        }
    }
}
